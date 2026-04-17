import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card-bg",
        "border border-card-border",
        "rounded-card",
        "p-card-padding",
        "transition-all duration-[var(--motion-fast)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-[var(--space-4)]", className)} {...props}>
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
        "text-card-title font-card-title text-text-primary",
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
        "text-card-desc text-text-secondary mt-1",
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
