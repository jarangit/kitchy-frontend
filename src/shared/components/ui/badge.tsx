import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "accent";

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
  accent: "bg-badge-accent-bg text-badge-accent-text",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-badge-padding-x py-badge-padding-y text-badge",
  md: "min-h-7 px-2.5 py-0.5 text-label",
  lg: "min-w-[60px] px-3 py-1 text-label font-[var(--weight-semibold)] text-center",
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
