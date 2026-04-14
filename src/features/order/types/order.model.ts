import type { OrderStatus } from "@/features/order/types/order.dto";

export interface IOrderItem {
  id: string;
  orderNumber: string;
  previousOrderNumber?: string | null;
  type: string;
  status: OrderStatus;
  isArchived: boolean;
  archivedAt: null;
  isWaitingInStore: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrderFormData {
  name: string;
}
