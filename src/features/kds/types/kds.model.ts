export type KdsStatus = "PENDING" | "READY";

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
  orderNumber: string;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  createdAt: string;
}
