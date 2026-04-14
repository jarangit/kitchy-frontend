export type KdsStatus = "PENDING" | "COOKING" | "READY";

export interface KdsItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  status: KdsStatus;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  createdAt: string;
  stationId?: string;
  stationName?: string;
  items: KdsItem[];
}

export interface KdsColumn {
  key: KdsStatus;
  title: string;
  emptyMessage: string;
}
