export interface ICreateOrder {
  orderNumber: string;
  orderType: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  products: { productId: string; quantity: number }[];
  isWaitingInStore?: boolean;
}

export interface IUpdateOrder {
  id: string;
  type?: "TOGO" | "DINEIN" | "";
  status?: "PENDING" | "COMPLETED";
  orderNumber?: string;
  isWaitingInStore?: boolean;
}
