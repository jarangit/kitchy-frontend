import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-button-height-sm w-button-height-sm",
  lg: "h-button-height-md w-button-height-md",
};

export function IconButton({
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "text-text-secondary transition-colors duration-[var(--motion-fast)]",
        "hover:bg-surface-hover hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
