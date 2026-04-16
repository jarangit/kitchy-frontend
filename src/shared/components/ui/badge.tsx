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
  default: "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]",
  success: "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",
  danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",
  warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",
  info: "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-[length:var(--badge-font-size)]",
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
        "rounded-[var(--badge-radius)]",
        "font-[var(--badge-font-weight)]",
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
