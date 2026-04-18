import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Optional text shown in place of children when loading. */
  loadingText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover",
  secondary:
    "bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border hover:bg-button-secondary-bg-hover",
  danger:
    "bg-button-danger-bg text-button-danger-text hover:bg-button-danger-bg-hover",
  ghost:
    "bg-button-ghost-bg text-button-ghost-text hover:bg-button-ghost-bg-hover",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-button-height-sm px-3 text-button-sm gap-1.5",
  md: "h-button-height-md px-button-padding-x text-button-md gap-2",
  lg: "h-button-height-lg px-6 text-button-lg gap-2",
  icon: "h-button-height-md w-button-height-md p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading = false,
  loadingText,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-button",
        "font-button",
        "whitespace-nowrap",
        "transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
        "outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="sm" aria-hidden />}
      {loading && loadingText !== undefined ? loadingText : children}
    </button>
  );
}
