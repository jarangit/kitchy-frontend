import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type PillVariant = "surface" | "success" | "warning" | "danger";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
}

const variantStyles: Record<PillVariant, string> = {
  surface: "bg-surface text-text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

export function Pill({ variant = "surface", className, children, ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full leading-none transition-colors duration-[var(--motion-fast)]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
