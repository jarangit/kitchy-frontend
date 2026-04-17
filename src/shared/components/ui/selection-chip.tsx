import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface SelectionChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function SelectionChip({
  active = false,
  className,
  children,
  ...props
}: SelectionChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "h-selection-height rounded-selection",
        "border text-selection font-selection",
        "transition-all duration-[var(--motion-fast)] active:scale-[0.98]",
        active
          ? "border-selection-active-border bg-selection-active-bg text-selection-active-text"
          : "border-selection-border text-selection-text hover:border-selection-border-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
