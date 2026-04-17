import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface IconTileProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
  /** Square with rounded-card instead of full circle. */
  shape?: "circle" | "square";
  className?: string;
}

const sizeClass: Record<NonNullable<IconTileProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

const toneClass: Record<NonNullable<IconTileProps["tone"]>, string> = {
  neutral: "bg-surface text-text-secondary",
  primary: "bg-primary-bg text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

/**
 * Standardized icon avatar used across dashboard, settings rows, and list items.
 * Default is a neutral grey circle; tonal variants use `-bg` surfaces for calm accents.
 */
export function IconTile({
  children,
  size = "md",
  tone = "neutral",
  shape = "circle",
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        sizeClass[size],
        toneClass[tone],
        shape === "circle" ? "rounded-full" : "rounded-card",
        className,
      )}
    >
      {children}
    </span>
  );
}
