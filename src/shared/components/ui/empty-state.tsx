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
        "flex flex-col items-center justify-center px-4 py-20",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 text-text-tertiary">{icon}</div>
      )}
      <h3 className="mb-1 text-subtitle font-[var(--weight-medium)] text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="max-w-xs text-center text-body-sm leading-6 text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
