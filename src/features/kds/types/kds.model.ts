export type KdsStatus = "PENDING" | "READY" | "SERVED";

/**
 * One card = one order-station-item.
 * Each card shows a single product with its parent order info.
 */
export interface KdsCard {
  /** order-station-item ID -- used as React key and for PATCH */
  orderStationItemId: string;
  /** order-item ID -- required by PATCH endpoint */
  orderItemId: string;
  status: KdsStatus;

  /* ── Product info ─────────────────────────── */
  productName: string;
  quantity: number;
  note?: string;

  /* ── Parent order info ────────────────────── */
  orderId: string;
  orderNumber: string;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  createdAt: string;
}

/**
 * One order as displayed on the KDS board. Aggregates every
 * station-item belonging to the same order at the current station
 * into a single card. The aggregate `status` is the worst-case of
 * its items (PENDING > READY > SERVED) so a card stays in the
 * leftmost column until all of its items have caught up.
 */
export interface KdsOrderGroup {
  orderId: string;
  orderNumber: string;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  /** Earliest `createdAt` among the group's items -- drives FIFO sort. */
  createdAt: string;
  status: KdsStatus;
  items: KdsCard[];
}
