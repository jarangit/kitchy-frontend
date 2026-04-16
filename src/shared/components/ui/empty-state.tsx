import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-4",
        className,
      )}
    >
      {icon && (
        <div className="text-[var(--color-text-tertiary)] mb-5">{icon}</div>
      )}
      <h3 className="text-subtitle font-[var(--weight-medium)] text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-body-sm text-[var(--color-text-secondary)] text-center max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
