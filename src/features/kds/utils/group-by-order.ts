import type {
  KdsCard,
  KdsOrderGroup,
  KdsStatus,
} from "@/features/kds/types/kds.model";
import { compareOrderNumber } from "@/features/kds/utils/parse-order-number";

/**
 * Order-of-precedence used to pick the worst-case status for a group:
 * an order stays in the leftmost column until every item has caught up.
 */
const STATUS_PRIORITY: Record<KdsStatus, number> = {
  PENDING: 0,
  READY: 1,
  SERVED: 2,
};

const aggregateStatus = (statuses: KdsStatus[]): KdsStatus => {
  let worst: KdsStatus = "SERVED";
  let worstRank = Infinity;
  for (const status of statuses) {
    const rank = STATUS_PRIORITY[status];
    if (rank < worstRank) {
      worst = status;
      worstRank = rank;
    }
  }
  return worst;
};

/**
 * Groups flat station-items by their parent order. Items within a group
 * are sorted by `createdAt` (oldest first) so the kitchen works in FIFO
 * order. The outer array is sorted by `orderNumber` numeric suffix
 * (ascending) so the KDS columns line up left-to-right in the order
 * they were placed -- the Expediter view in the KFC reference does the
 * same.
 *
 * Order-level fields are taken from the first item in the group
 * (every item in the same order carries the same order-level metadata).
 */
export const groupCardsByOrder = (cards: KdsCard[]): KdsOrderGroup[] => {
  if (cards.length === 0) return [];

  const groups = new Map<string, KdsCard[]>();
  for (const card of cards) {
    const list = groups.get(card.orderId);
    if (list) {
      list.push(card);
    } else {
      groups.set(card.orderId, [card]);
    }
  }

  const result: KdsOrderGroup[] = [];
  for (const [orderId, items] of groups) {
    const sortedItems = [...items].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const first = sortedItems[0];
    if (!first) continue;

    const createdAt = sortedItems.reduce(
      (earliest, item) =>
        new Date(item.createdAt).getTime() < new Date(earliest).getTime()
          ? item.createdAt
          : earliest,
      sortedItems[0].createdAt,
    );

    result.push({
      orderId,
      orderNumber: first.orderNumber,
      orderType: first.orderType,
      tableNumber: first.tableNumber,
      customerName: first.customerName,
      deliveryPlatform: first.deliveryPlatform,
      deliveryOrderNumber: first.deliveryOrderNumber,
      createdAt,
      status: aggregateStatus(sortedItems.map((i) => i.status)),
      items: sortedItems,
    });
  }

  return result.sort((a, b) =>
    compareOrderNumber(a.orderNumber, b.orderNumber),
  );
};
