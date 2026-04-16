import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)]",
  danger:
    "bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-bg-hover)]",
  ghost:
    "bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-bg-hover)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-[var(--button-height-sm)] px-3 text-[length:var(--button-font-size-sm)] gap-1.5",
  md: "h-[var(--button-height-md)] px-[var(--button-padding-x)] text-[length:var(--button-font-size-md)] gap-2",
  lg: "h-[var(--button-height-lg)] px-6 text-[length:var(--button-font-size-lg)] gap-2",
  icon: "h-[var(--button-height-md)] w-[var(--button-height-md)] p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-[var(--button-radius)]",
        "font-[var(--button-font-weight)]",
        "whitespace-nowrap",
        "transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
        "outline-none cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98] shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
