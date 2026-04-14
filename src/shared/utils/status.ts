import type { BadgeVariant } from "@/shared/components/ui/badge";

export const toStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "COMPLETED":
    case "READY":
      return "success";
    case "PENDING":
      return "warning";
    case "COOKING":
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
      return "border-l-[var(--color-success)]";
    case "warning":
      return "border-l-[var(--color-warning)]";
    case "info":
      return "border-l-[var(--color-info)]";
    case "danger":
      return "border-l-[var(--color-danger)]";
    default:
      return "border-l-[var(--color-border)]";
  }
};
