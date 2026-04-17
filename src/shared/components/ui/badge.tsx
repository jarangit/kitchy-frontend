import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-badge-default-bg text-badge-default-text",
  success: "bg-badge-success-bg text-badge-success-text",
  danger: "bg-badge-danger-bg text-badge-danger-text",
  warning: "bg-badge-warning-bg text-badge-warning-text",
  info: "bg-badge-info-bg text-badge-info-text",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-badge-padding-x py-badge-padding-y text-badge",
  md: "px-2.5 py-0.5 text-label min-h-7",
  lg: "px-3 py-1 text-subtitle font-[var(--weight-bold)] min-w-[60px] text-center",
};

export function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-badge",
        "font-badge",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
