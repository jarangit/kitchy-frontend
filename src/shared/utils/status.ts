import type { BadgeVariant } from "@/shared/components/ui/badge";

/**
 * Strategy table for status-derived UI affordances.
 *
 * Replaces two parallel `switch` blocks (badge variant + border class +
 * label) with a single source of truth keyed by raw status string. Adding
 * a new status = adding one row.
 *
 * Consumers that still need the old two-function API are kept as thin
 * wrappers so existing call sites do not need a sweeping update.
 */
interface StatusMeta {
  variant: BadgeVariant;
  label: string;
  borderClass: string;
}

const borderClassFor = (variant: BadgeVariant): string => {
  switch (variant) {
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

const statusTable: Record<string, StatusMeta> = {
  NEW: { variant: "default", label: "New", borderClass: borderClassFor("default") },
  PREPARING: {
    variant: "info",
    label: "Preparing",
    borderClass: borderClassFor("info"),
  },
  COOKING: {
    variant: "info",
    label: "Cooking",
    borderClass: borderClassFor("info"),
  },
  PENDING: {
    variant: "warning",
    label: "Pending",
    borderClass: borderClassFor("warning"),
  },
  READY: {
    variant: "success",
    label: "Ready",
    borderClass: borderClassFor("success"),
  },
  COMPLETED: {
    variant: "success",
    label: "Completed",
    borderClass: borderClassFor("success"),
  },
  CANCELLED: {
    variant: "danger",
    label: "Cancelled",
    borderClass: borderClassFor("danger"),
  },
};

const fallback: StatusMeta = {
  variant: "default",
  label: "",
  borderClass: borderClassFor("default"),
};

/** Returns the full UI metadata for a given status. */
export const getStatusMeta = (status: string): StatusMeta =>
  statusTable[status] ?? { ...fallback, label: status };

/* ── Back-compat shims: prefer getStatusMeta in new code ─────── */

export const toStatusBadgeVariant = (status: string): BadgeVariant =>
  getStatusMeta(status).variant;

export const toStatusBorderClass = (status: string): string =>
  getStatusMeta(status).borderClass;

export const formatStatusLabel = (status: string): string =>
  getStatusMeta(status).label || status;

/* ── Order type labels (orthogonal table) ────────────────────── */

const TYPE_LABELS: Record<string, string> = {
  DINE_IN: "Dine In",
  DINEIN: "Dine In",
  TOGO: "To Go",
  DELIVERY: "Delivery",
};

export const formatOrderTypeLabel = (type: string): string =>
  TYPE_LABELS[type] ?? type;
