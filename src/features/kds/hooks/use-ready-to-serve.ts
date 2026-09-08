import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useStationService } from "@/features/station/hooks/useStation";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import { useRealtimeConnected } from "@/shared/realtime/realtime-provider";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type { KdsStatus } from "@/features/kds/types/kds.model";

export type ReadyToServeItem = {
  id: string;
  orderId: string;
  stationId: string;
  stationName: string;
  orderItemId: string;
  productName: string;
  quantity: number;
  note?: string;
  orderNumber: string;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  createdAt: string;
  /** Preparation state of this station item: PENDING = cooking, READY = ready to serve, SERVED = served. */
  status: KdsStatus;
};

const toServeStatus = (backendStatus: string): KdsStatus => {
  if (backendStatus === "served") return "SERVED";
  return backendStatus === "complete" ? "READY" : "PENDING";
};

type StationLite = { id: string; name?: string };

/**
 * All station items across every station, each carrying its own
 * preparation status (PENDING = cooking, READY = ready to serve,
 * SERVED = served). Sorted FIFO by order creation time.
 */
export const useServeBoardItems = () => {
  const isRealtimeConnected = useRealtimeConnected();
  const refetchInterval: number | false = isRealtimeConnected ? false : 5000;
  const { stationsQuery } = useStationService({});

  const stations = useMemo(() => {
    return (stationsQuery ?? []) as StationLite[];
  }, [stationsQuery]);

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

  const items = useMemo<ReadyToServeItem[]>(() => {
    const allItems: ReadyToServeItem[] = [];

    for (let i = 0; i < results.length; i += 1) {
      const station = stations[i];
      if (!station) continue;

      const stationItems = unwrapPayload<IOrderStationItemDto>(results[i].data);
      for (const item of stationItems) {
        const orderItem = item.orderItem;
        if (!orderItem) continue;

        allItems.push({
          id: item.id,
          orderId: orderItem.order?.id ?? "",
          stationId: station.id,
          stationName: station.name ?? "Kitchen",
          orderItemId: orderItem.id,
          productName: orderItem.product?.name ?? "",
          quantity: orderItem.quantity ?? 1,
          note: orderItem.notes ?? undefined,
          orderNumber: orderItem.order?.orderNumber ?? "-",
          orderType: orderItem.order?.orderType,
          tableNumber: orderItem.order?.tableNumber,
          customerName: orderItem.order?.customerName,
          deliveryPlatform: orderItem.order?.deliveryPlatform,
          deliveryOrderNumber: orderItem.order?.deliveryOrderNumber,
          createdAt: orderItem.order?.createdAt ?? new Date().toISOString(),
          status: toServeStatus(item.status),
        });
      }
    }

    return allItems.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [results, stations]);

  const isLoading = results.length > 0 && results.some((r) => r.isLoading);
  const isRefetching = results.some((r) => r.isRefetching);
  const readyCount = useMemo(
    () => items.filter((item) => item.status === "READY").length,
    [items],
  );

  return { items, count: items.length, readyCount, isLoading, isRefetching };
};

export const useReadyToServeItems = () => {
  const { items, isLoading, isRefetching } = useServeBoardItems();

  const readyItems = useMemo(
    () => items.filter((item) => item.status === "READY"),
    [items],
  );

  return {
    items: readyItems,
    count: readyItems.length,
    isLoading,
    isRefetching,
  };
};

export const useReadyToServeCount = () => {
  const { count, isLoading } = useReadyToServeItems();
  return { count, isLoading };
};
