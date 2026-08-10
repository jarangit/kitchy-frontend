import type { MessageKey } from "@/shared/i18n/messages";

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

/**
 * Maps a transaction's payment `method` value to a friendly i18n key.
 * Known methods resolve to dedicated keys; any other non-empty value is
 * treated as a delivery platform name and resolves to the "paid via
 * platform" key (callers interpolate the platform name). Returns `null`
 * for empty values so callers can render a placeholder.
 */
export const getPaymentMethodLabelKey = (
  method?: string,
): MessageKey | null => {
  switch (method?.trim().toUpperCase()) {
    case "CASH":
      return "transaction.method.cash";
    case "QR":
      return "transaction.method.qr";
    default:
      return method?.trim() ? "transaction.method.viaPlatform" : null;
  }
};
