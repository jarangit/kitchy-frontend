import type { KdsStatus } from "@/features/kds/types/kds.model";

export interface IKdsOrderProductDto {
  id?: string;
  productId?: string;
  name?: string;
  productName?: string;
  quantity?: number;
  note?: string;
  product?: {
    name?: string;
  };
}

export interface IKdsOrderDto {
  id: string;
  orderNumber: string;
  status: string;
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  type?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  createdAt: string;
  stationId?: string;
  stationName?: string;
  products?: IKdsOrderProductDto[];
  items?: IKdsOrderProductDto[];
}

export interface IKdsUpdateStatusPayload {
  orderId: string;
  status: KdsStatus;
}
