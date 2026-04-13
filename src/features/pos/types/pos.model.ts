export interface ICartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentMethod = "CASH" | "QR" | "TRANSFER";

export interface IPaymentInfo {
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number; // for cash
  change?: number;
}
