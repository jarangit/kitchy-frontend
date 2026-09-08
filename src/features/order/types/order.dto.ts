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

export interface ICreateOrderProduct {
  productId: string;
  quantity: number;
  note?: string;
  modifiers?: { modifierGroupId: string; modifierOptionIds: string[] }[];
}

export interface ICreateOrder {
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  products: ICreateOrderProduct[];
  isWaitingInStore?: boolean;
}

export interface IUpdateOrder {
  id: string;
  type?: "TOGO" | "DINE_IN" | "";
  status?: OrderStatus;
  orderNumber?: string;
  isWaitingInStore?: boolean;
}
