import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant =
  "default" | "success" | "danger" | "warning" | "info" | "accent";

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
  sm: "h-[30px] px-badge-padding-x text-badge leading-5",
  md: "h-[30px] px-3 text-label leading-5",
  lg: "h-[30px] min-w-[72px] px-3.5 text-label font-semibold text-center leading-5",
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
        "inline-flex items-center justify-center whitespace-nowrap",
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
