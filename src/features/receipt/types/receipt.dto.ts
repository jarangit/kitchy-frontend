export type ReceiptOrderStatus =
  "NEW" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type ReceiptOrderType = "DINE_IN" | "TOGO" | "DELIVERY";

export type ReceiptPaymentMethod = "CASH" | "QR" | "DELIVERY_PLATFORM";

export interface PublicReceiptItemDto {
  name: string;
  quantity: number;
  price: number;
  total: number;
  note?: string;
}

export interface PublicReceiptDto {
  receiptId: string;
  receiptToken: string;
  orderId: string;
  orderNumber: string;
  storeName: string;
  status: ReceiptOrderStatus;
  orderType: ReceiptOrderType;
  tableNumber?: string;
  items: PublicReceiptItemDto[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: ReceiptPaymentMethod;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ReceiptUpdatedPayload {
  receiptToken: string;
  orderId: string;
  orderNumber: string;
  status: ReceiptOrderStatus;
  updatedAt: string;
}

export interface ReceiptExpiredPayload {
  receiptToken: string;
  expiredAt: string;
}
