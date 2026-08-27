import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStationService } from "@/features/station/hooks/useStation";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import { useRealtimeConnected } from "@/shared/realtime/realtime-provider";
import { normalizeStatus } from "@/features/order/utils/order-normalizer";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { readReadyToServeDismissed } from "@/features/kds/utils/ready-to-serve-dismissed";
import { appBus } from "@/shared/events/app-events";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";

type StationLite = { id: string; name?: string };

interface OperationOrderLite {
  id: string;
  orderNumber: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  type?: string;
}

const isSameCalendarDay = (
  dateValue: string | undefined,
  targetDate: Date,
): boolean => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
};

const parseTimeLabel = (iso?: string): string => {
  if (!iso) return "--:--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--:--";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const elapsedMinutesLabel = (iso?: string): number => {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 60000));
};

const toOrderLite = (raw: unknown): OperationOrderLite | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id =
    typeof r.id === "string" ? r.id : typeof r._id === "string" ? r._id : "";
  const orderNumber =
    typeof r.orderNumber === "string"
      ? r.orderNumber
      : typeof r.number === "string"
        ? r.number
        : "";
  if (!id && !orderNumber) return null;
  return {
    id: id || orderNumber,
    orderNumber: orderNumber || id,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : undefined,
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : undefined,
    status: typeof r.status === "string" ? r.status : undefined,
    type: typeof r.type === "string" ? r.type : undefined,
  };
};

const getOrderItemsCount = (raw: unknown): number => {
  if (!raw || typeof raw !== "object") return 1;
  const r = raw as Record<string, unknown>;
  // try common shapes
  const candidates: unknown[] = [
    r.products,
    r.items,
    r.orderItems,
    r.order_items,
    r.lines,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c.length || 1;
  }
  // demo fallback: count via meta would already be in products but we already checked
  // if quantity fields exist sum them?
  if (typeof r.itemCount === "number") return r.itemCount;
  if (typeof r.totalQuantity === "number") return r.totalQuantity;
  return 1;
};

export function useStoreOperations() {
  const { ordersQuery: rawOrders } = useOrderService({});
  const { stationsQuery } = useStationService({});
  const { items: readyToServeItems } = useReadyToServeItems();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const [dismissedReadyItems, setDismissedReadyItems] = useState(() =>
    readReadyToServeDismissed(storeId),
  );
  const isRealtimeConnected = useRealtimeConnected();
  const refetchInterval: number | false = isRealtimeConnected ? false : 5000;

  useEffect(() => {
    setDismissedReadyItems(readReadyToServeDismissed(storeId));
  }, [storeId]);

  useEffect(() => {
    return appBus.on("ui:readyToServeDismissed", () => {
      setDismissedReadyItems(readReadyToServeDismissed(storeId));
    });
  }, [storeId]);

  const stations = useMemo(
    () => (stationsQuery ?? []) as StationLite[],
    [stationsQuery],
  );

  const results = useQueries({
    queries: stations.map((station) => ({
      queryKey: ["kds-orders", station.id],
      queryFn: async () => {
        const response = await orderApiService.getOrderStationItemsByStationId(
          station.id,
        );
        return response.data as unknown;
      },
      enabled: !!station.id,
      refetchInterval,
      refetchIntervalInBackground: true,
    })),
  });

  const todayOrders = useMemo(() => {
    const today = new Date();
    const arr = Array.isArray(rawOrders) ? rawOrders : [];
    const mapped = arr
      .map(toOrderLite)
      .filter((v): v is OperationOrderLite => v !== null);
    return mapped.filter((o) => isSameCalendarDay(o.createdAt, today));
  }, [rawOrders]);

  const todayOpenOrders = useMemo(() => {
    return todayOrders.filter((o) => {
      const rawStatus = o.status ?? "PENDING";
      return normalizeStatus(rawStatus) === "PENDING";
    });
  }, [todayOrders]);

  const kitchenAndReady = useMemo(() => {
    const byOrder = new Map<
      string,
      {
        orderNumber: string;
        createdAt: string;
        statuses: string[];
        count: number;
      }
    >();

    for (let i = 0; i < results.length; i += 1) {
      const stationItems = unwrapPayload<IOrderStationItemDto>(
        results[i]?.data,
      );
      for (const item of stationItems) {
        const order = item.orderItem?.order;
        if (!order) continue;
        const key = order.id || order.orderNumber;
        if (!key) continue;
        const existing = byOrder.get(key);
        if (!existing) {
          byOrder.set(key, {
            orderNumber: order.orderNumber,
            createdAt: order.createdAt ?? new Date().toISOString(),
            statuses: [item.status],
            count: 1,
          });
        } else {
          existing.statuses.push(item.status);
          existing.count += 1;
        }
      }
    }

    const pending: Array<{
      orderNumber: string;
      createdAt: string;
      count: number;
    }> = [];
    byOrder.forEach((v) => {
      const hasPending = v.statuses.includes("pending");
      if (hasPending) {
        pending.push({
          orderNumber: v.orderNumber,
          createdAt: v.createdAt,
          count: v.count,
        });
      }
    });

    const sortDesc = (a: { createdAt: string }, b: { createdAt: string }) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    pending.sort(sortDesc);
    return { pending };
  }, [results]);

  const sortedTodayOrders = useMemo(() => {
    return [...todayOrders].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );
  }, [todayOrders]);

  const sortedTodayOpenOrders = useMemo(() => {
    return [...todayOpenOrders].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );
  }, [todayOpenOrders]);

  const visibleReadyToServeItems = useMemo(() => {
    return readyToServeItems.filter(
      (item) => !dismissedReadyItems.has(item.id),
    );
  }, [readyToServeItems, dismissedReadyItems]);

  return {
    todayOrders: sortedTodayOrders,
    todayOrdersCount: sortedTodayOrders.length,
    todayOpenOrders: sortedTodayOpenOrders,
    todayOpenOrdersCount: sortedTodayOpenOrders.length,
    kitchenPending: kitchenAndReady.pending,
    kitchenPendingCount: kitchenAndReady.pending.length,
    readyToServe: visibleReadyToServeItems,
    readyToServeCount: visibleReadyToServeItems.length,
    parseTimeLabel,
    elapsedMinutesLabel,
    getOrderItemsCount,
    rawOrders,
  };
}
