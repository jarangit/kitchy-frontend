import type { PaymentMethod } from "./pos.model";

export interface ICreatePaymentRequest {
  orderId: string;
  storeId: string;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
}

export interface IPaymentResponse {
  id: string;
  orderId: string;
  storeId: string;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
  change?: number;
  receiptId: string;
  createdAt: string;
}
