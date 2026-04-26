export type OrderType = "DINE_IN" | "TOGO" | "DELIVERY";

export type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "READY"
  | "PENDING"
  | "COOKING"
  | "COMPLETED"
  | "CANCELLED";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface ICreateOrder {
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  products: { productId: string; quantity: number; note?: string }[];
  isWaitingInStore?: boolean;
}

export interface IUpdateOrder {
  id: string;
  type?: "TOGO" | "DINE_IN" | "";
  status?: OrderStatus;
  orderNumber?: string;
  isWaitingInStore?: boolean;
}
