export type KdsStatus = "PENDING" | "COOKING" | "READY";

export interface KdsItem {
  id: string;
  name: string;
  quantity: number;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  status: KdsStatus;
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
