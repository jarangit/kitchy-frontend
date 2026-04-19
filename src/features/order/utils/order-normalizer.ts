import type { OrderStatus } from "@/features/order/types/order.dto";

/**
 * Backend may emit order `type` in multiple legacy shapes.
 * Normalize to the canonical UI type.
 */
export const normalizeType = (type: string): string => {
  if (type === "DINEIN") return "DINE_IN";
  return type;
};

/**
 * Backend may emit finer-grained order statuses than the UI cares about.
 * Collapse to the 2-bucket UI model: PENDING vs COMPLETED.
 */
export const normalizeStatus = (status: string): OrderStatus => {
  if (status === "NEW" || status === "PREPARING") return "PENDING";
  if (status === "READY") return "COMPLETED";
  return status as OrderStatus;
};
