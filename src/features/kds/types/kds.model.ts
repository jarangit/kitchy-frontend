export type KdsStatus = "PENDING" | "COOKING" | "READY";

export interface KdsItem {
  id: number;
  name: string;
  quantity: number;
}

export interface KdsOrder {
  id: number;
  orderNumber: string;
  status: KdsStatus;
  createdAt: string;
  stationId?: number;
  stationName?: string;
  items: KdsItem[];
}

export interface KdsColumn {
  key: KdsStatus;
  title: string;
  emptyMessage: string;
}
