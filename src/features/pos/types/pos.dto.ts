import type { PaymentMethod } from "./pos.model";

export interface ICreatePaymentRequest {
  orderId: number;
  storeId: number;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
}

export interface IPaymentResponse {
  id: number;
  orderId: number;
  storeId: number;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
  change?: number;
  receiptId: string;
  createdAt: string;
}
