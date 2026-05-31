import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

type CardVariant = "default" | "muted" | "interactive" | "dashed";
type CardPadding = "md" | "sm" | "none";

type CardProps<T extends ElementType = "div"> = {
  as?: T;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card-bg border border-card-border",
  muted: "bg-surface-muted border border-border",
  interactive:
    "bg-card-bg border border-card-border hover:bg-card-bg-hover hover:border-card-border-hover",
  dashed: "bg-bg border border-dashed border-border",
};

const paddingStyles: Record<CardPadding, string> = {
  md: "p-card-padding",
  sm: "p-4",
  none: "p-0",
};

export function Card<T extends ElementType = "div">({
  as,
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "rounded-card transition-colors duration-[var(--motion-fast)]",
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

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-card-title font-card-title text-text-primary tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-card-desc leading-6 text-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
