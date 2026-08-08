import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import { appBus } from "@/shared/events/app-events";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type {
  KdsCard,
  KdsOrderGroup,
  KdsStatus,
} from "@/features/kds/types/kds.model";
import { groupCardsByOrder } from "@/features/kds/utils/group-by-order";

/**
 * Visual confirmation window for the BUMPED state shown on an order
 * column after a successful BUMP click. Matches the KFC Expediter
 * reference (~1.5s) before the order is removed from the board.
 */
const BUMPED_TRANSITION_MS = 1500;

/**
 * Map backend status ('pending' | 'complete' | 'served') to KDS UI status.
 */
const toKdsStatus = (backendStatus: string): KdsStatus => {
  if (backendStatus === "served") return "SERVED";
  return backendStatus === "complete" ? "READY" : "PENDING";
};

/**
 * Map KDS UI status back to backend status for PATCH.
 */
const toBackendStatus = (
  kdsStatus: KdsStatus,
): "pending" | "complete" | "served" => {
  if (kdsStatus === "SERVED") return "served";
  return kdsStatus === "READY" ? "complete" : "pending";
};

/**
 * Map each order-station-item to a flat KdsCard.
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
      orderId: oi.order?.id ?? "",
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [bumpedOrderId, setBumpedOrderId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["kds-orders", stationId],
    queryFn: async () => {
      const response = await orderApiService.getOrderStationItemsByStationId(
        stationId as string,
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

  const groups = useMemo<KdsOrderGroup[]>(() => {
    return groupCardsByOrder(cards);
  }, [cards]);

  /**
   * Expediter view: only PENDING orders (kitchen still working on them).
   * The order keeps showing during the BUMPED transition even after the
   * refetch removes it from the source list, so the purple state is
   * never visually skipped.
   */
  const pendingGroups = useMemo(
    () => groups.filter((g) => g.status === "PENDING"),
    [groups],
  );

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

  /**
   * BUMP action for the Expediter view. The order column flips to the
   * purple BUMPED state immediately for visual confirmation, the user
   * sees it for `BUMPED_TRANSITION_MS`, and then the PATCH fires. After
   * refetch the order is no longer in the PENDING list, so the card
   * disappears and the remaining columns shift to fill the gap.
   */
  const bumpAndRemove = useCallback(
    async (group: KdsOrderGroup) => {
      if (!stationId || isUpdating) return;
      if (group.status !== "PENDING") return;

      const itemsToAdvance = group.items.filter(
        (item) => item.status === "PENDING",
      );
      if (itemsToAdvance.length === 0) return;

      setBumpedOrderId(group.orderId);
      setIsUpdating(true);

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, BUMPED_TRANSITION_MS),
        );

        for (const item of itemsToAdvance) {
          await orderApiService.updateOrderStationItem(
            item.orderStationItemId,
            {
              status: toBackendStatus("READY"),
              stationId,
              orderItemId: item.orderItemId,
            },
          );

          appBus.emit("order:statusChanged", {
            orderStationItemId: item.orderStationItemId,
            from: item.status,
            to: "READY",
            stationId,
          });
        }
        await query.refetch();
      } finally {
        setBumpedOrderId(null);
        setIsUpdating(false);
      }
    },
    [stationId, isUpdating, query],
  );

  return {
    cards,
    groups,
    pendingGroups,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    updateStatus,
    bumpAndRemove,
    bumpedOrderId,
    isUpdating,
  };
};
