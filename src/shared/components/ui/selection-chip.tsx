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
          "inline-flex h-selection-height w-full items-center justify-center gap-2 rounded-selection px-5",
          "border text-selection font-selection",
          "transition-colors duration-[var(--motion-fast)]",
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
