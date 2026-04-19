export interface TransactionOrderItem {
  id?: string;
  productId?: string;
  name?: string;
  quantity?: number;
  price?: number;
  note?: string;
  product?: { name?: string; price?: number };
}

export type FlowStatus = "IN_PROGRESS" | "DONE" | "CANCELLED";

const DONE_STATUSES = ["READY", "COMPLETED"];

export const getItemName = (item: TransactionOrderItem) =>
  item.name || item.product?.name || `Product #${item.productId ?? "?"}`;

export const getItemPrice = (item: TransactionOrderItem) =>
  item.price ?? item.product?.price ?? 0;

export const formatCurrency = (amount: number) => `฿${amount.toFixed(2)}`;

export const toFlowStatus = (status: string): FlowStatus => {
  if (status === "CANCELLED") return "CANCELLED";
  if (DONE_STATUSES.includes(status)) return "DONE";
  return "IN_PROGRESS";
};

