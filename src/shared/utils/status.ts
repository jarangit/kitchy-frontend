import type { BadgeVariant } from "@/shared/components/ui/badge";

export const toStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "COMPLETED":
    case "READY":
      return "success";
    case "PENDING":
      return "warning";
    case "COOKING":
    case "PREPARING":
      return "info";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
};

export const toStatusBorderClass = (status: string): string => {
  switch (toStatusBadgeVariant(status)) {
    case "success":
      return "border-l-success";
    case "warning":
      return "border-l-warning";
    case "info":
      return "border-l-info";
    case "danger":
      return "border-l-danger";
    default:
      return "border-l-border";
  }
};

/* ── Human-readable labels ───────────────────────── */

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  PREPARING: "Preparing",
  READY: "Ready",
  PENDING: "Pending",
  COOKING: "Cooking",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const formatStatusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status;

const TYPE_LABELS: Record<string, string> = {
  DINE_IN: "Dine In",
  DINEIN: "Dine In",
  TOGO: "To Go",
  DELIVERY: "Delivery",
};

export const formatOrderTypeLabel = (type: string): string =>
  TYPE_LABELS[type] ?? type;
