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
        "h-[var(--selection-height)] rounded-[var(--selection-radius)]",
        "border text-[length:var(--selection-font-size)] font-[var(--selection-font-weight)]",
        "transition-all duration-[var(--motion-fast)] active:scale-[0.98]",
        active
          ? "border-[var(--selection-active-border)] bg-[var(--selection-active-bg)] text-[var(--selection-active-text)]"
          : "border-[var(--selection-border)] text-[var(--selection-text)] hover:border-[var(--selection-border-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
