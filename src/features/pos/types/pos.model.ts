export interface ICartItem {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export type PaymentMethod = "CASH" | "QR";

export type OrderType = "DINE_IN" | "TOGO" | "DELIVERY";

export interface IPaymentInfo {
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number; // for cash
  change?: number;
}
