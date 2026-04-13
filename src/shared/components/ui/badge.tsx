import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: `
    bg-[var(--color-surface)]
    text-[var(--color-text-secondary)]
  `,
  success: `
    bg-[var(--color-success-bg)]
    text-[var(--color-success)]
  `,
  danger: `
    bg-[var(--color-danger-bg)]
    text-[var(--color-danger)]
  `,
  warning: `
    bg-[var(--color-warning-bg)]
    text-[var(--color-warning)]
  `,
  info: `
    bg-[var(--color-info-bg)]
    text-[var(--color-info)]
  `,
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-[var(--badge-radius)]
        px-[var(--badge-padding-x)]
        py-[var(--badge-padding-y)]
        text-xs font-[var(--font-weight-medium)]
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
