import type { KdsStatus } from "@/features/kds/types/kds.model";

export interface IKdsOrderProductDto {
  id?: number;
  productId?: number;
  name?: string;
  quantity?: number;
}

export interface IKdsOrderDto {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  stationId?: number;
  stationName?: string;
  products?: IKdsOrderProductDto[];
}

export interface IKdsUpdateStatusPayload {
  orderId: number;
  status: KdsStatus;
}
