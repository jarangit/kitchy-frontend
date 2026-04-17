import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ChipTabSize = "sm" | "md" | "lg";

interface ChipTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: ChipTabSize;
  children: ReactNode;
}

const sizeStyles: Record<ChipTabSize, string> = {
  sm: "min-h-chip-height-sm px-chip-padding-x text-chip",
  md: "min-h-chip-height-md px-5 text-chip",
  lg: "min-h-chip-height-lg px-6 text-body",
};

export function ChipTab({
  active = false,
  size = "md",
  className,
  children,
  ...props
}: ChipTabProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "rounded-chip",
        "font-chip",
        "transition-all duration-[var(--motion-fast)] active:scale-[0.98]",
        sizeStyles[size],
        active
          ? "bg-chip-active-bg text-chip-active-text"
          : "bg-chip-inactive-bg text-chip-inactive-text hover:bg-chip-inactive-bg-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
