import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type InsetPanelVariant = "default" | "interactive" | "dashed";
type InsetPanelPadding = "md" | "sm" | "lg" | "none";

type InsetPanelProps<T extends ElementType = "div"> = {
  as?: T;
  variant?: InsetPanelVariant;
  padding?: InsetPanelPadding;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const variantStyles: Record<InsetPanelVariant, string> = {
  default: "border border-border bg-surface-muted",
  interactive:
    "border border-border bg-surface-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted-hover",
  dashed:
    "border border-dashed border-border bg-surface-muted text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted-hover hover:text-text-primary",
};

const paddingStyles: Record<InsetPanelPadding, string> = {
  md: "px-4 py-3",
  sm: "p-3",
  lg: "px-4 py-8",
  none: "p-0",
};

export function InsetPanel<T extends ElementType = "div">({
  as,
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: InsetPanelProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "rounded-md",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
