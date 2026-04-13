import type { KdsStatus } from "@/features/kds/types/kds.model";

export interface IKdsOrderProductDto {
  id?: string;
  productId?: string;
  name?: string;
  quantity?: number;
}

export interface IKdsOrderDto {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  stationId?: string;
  stationName?: string;
  products?: IKdsOrderProductDto[];
}

export interface IKdsUpdateStatusPayload {
  orderId: string;
  status: KdsStatus;
}
