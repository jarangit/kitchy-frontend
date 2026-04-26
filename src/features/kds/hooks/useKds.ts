import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import { appBus } from "@/shared/events/app-events";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type { KdsCard, KdsStatus } from "@/features/kds/types/kds.model";

/**
 * Map backend status ('pending' | 'complete') to KDS UI status.
 */
const toKdsStatus = (backendStatus: string): KdsStatus => {
  return backendStatus === "complete" ? "READY" : "PENDING";
};

/**
 * Map KDS UI status back to backend status for PATCH.
 */
const toBackendStatus = (kdsStatus: KdsStatus): "pending" | "complete" => {
  return kdsStatus === "READY" ? "complete" : "pending";
};

/**
 * Map each order-station-item to a flat KdsCard.
 * No grouping -- 1 backend item = 1 card.
 */
const mapToCards = (items: IOrderStationItemDto[]): KdsCard[] => {
  const cards: KdsCard[] = [];

  for (const item of items) {
    const oi = item.orderItem;
    if (!oi) continue;

    cards.push({
      orderStationItemId: item.id,
      orderItemId: oi.id,
      status: toKdsStatus(item.status),
      productName: oi.product?.name ?? "",
      quantity: oi.quantity ?? 1,
      note: oi.notes ?? undefined,
      orderNumber: oi.order?.orderNumber ?? "—",
      orderType: oi.order?.orderType,
      tableNumber: oi.order?.tableNumber,
      customerName: oi.order?.customerName,
      deliveryPlatform: oi.order?.deliveryPlatform,
      deliveryOrderNumber: oi.order?.deliveryOrderNumber,
      createdAt: oi.order?.createdAt ?? new Date().toISOString(),
    });
  }

  return cards;
};

export const useKds = (stationId?: string) => {
  const query = useQuery({
    queryKey: ["kds-orders", stationId],
    queryFn: async () => {
      const response = await orderApiService.getOrderStationItemsByStationId(
        stationId as string
      );
      return response.data as unknown;
    },
    enabled: !!stationId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const cards = useMemo<KdsCard[]>(() => {
    return mapToCards(unwrapPayload<IOrderStationItemDto>(query.data));
  }, [query.data]);

  const updateStatus = async (card: KdsCard, status: KdsStatus) => {
    if (!stationId) return;

    await orderApiService.updateOrderStationItem(card.orderStationItemId, {
      status: toBackendStatus(status),
      stationId,
      orderItemId: card.orderItemId,
    });

    appBus.emit("order:statusChanged", {
      orderStationItemId: card.orderStationItemId,
      from: card.status,
      to: status,
      stationId,
    });

    await query.refetch();
  };

  return {
    cards,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    updateStatus,
    isUpdating: false,
  };
};
