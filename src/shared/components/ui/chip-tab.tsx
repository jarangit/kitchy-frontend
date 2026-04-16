import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ChipTabSize = "sm" | "md" | "lg";

interface ChipTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: ChipTabSize;
  children: ReactNode;
}

const sizeStyles: Record<ChipTabSize, string> = {
  sm: "min-h-[var(--chip-height-sm)] px-[var(--chip-padding-x)] text-[length:var(--chip-font-size)]",
  md: "min-h-[var(--chip-height-md)] px-5 text-[length:var(--chip-font-size)]",
  lg: "min-h-[var(--chip-height-lg)] px-6 text-body",
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
        "rounded-[var(--chip-radius)]",
        "font-[var(--chip-font-weight)]",
        "transition-all duration-[var(--motion-fast)] active:scale-[0.98]",
        sizeStyles[size],
        active
          ? "bg-[var(--chip-active-bg)] text-[var(--chip-active-text)]"
          : "bg-[var(--chip-inactive-bg)] text-[var(--chip-inactive-text)] hover:bg-[var(--chip-inactive-bg-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
