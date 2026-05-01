import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useStationService } from "@/features/station/hooks/useStation";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";

export type ReadyToServeItem = {
  id: string;
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
};

type StationLite = { id: string; name?: string };

export const useReadyToServeItems = () => {
  const { stationsQuery } = useStationService({});

  const stations = useMemo(() => {
    return (stationsQuery ?? []) as StationLite[];
  }, [stationsQuery]);

  const results = useQueries({
    queries: stations.map((station) => ({
      queryKey: ["kds-orders", station.id],
      queryFn: async () => {
        const response = await orderApiService.getOrderStationItemsByStationId(
          station.id
        );
        return response.data as unknown;
      },
      enabled: !!station.id,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    })),
  });

  const items = useMemo<ReadyToServeItem[]>(() => {
    const readyItems: ReadyToServeItem[] = [];

    for (let i = 0; i < results.length; i += 1) {
      const station = stations[i];
      if (!station) continue;

      const stationItems = unwrapPayload<IOrderStationItemDto>(results[i].data);
      for (const item of stationItems) {
        if (item.status !== "complete") continue;
        const orderItem = item.orderItem;
        if (!orderItem) continue;

        readyItems.push({
          id: item.id,
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
        });
      }
    }

    return readyItems.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [results, stations]);

  const isLoading = results.length > 0 && results.some((r) => r.isLoading);
  const isRefetching = results.some((r) => r.isRefetching);

  return { items, count: items.length, isLoading, isRefetching };
};

export const useReadyToServeCount = () => {
  const { count, isLoading } = useReadyToServeItems();
  return { count, isLoading };
};
