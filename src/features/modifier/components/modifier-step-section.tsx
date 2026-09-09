import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

interface Props {
  step: number;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Numbered settings card used by the modifier detail flow. */
export function ModifierStepSection({
  step,
  title,
  subtitle,
  action,
  children,
  className,
}: Props) {
  return (
    <Card as="section" className={cn(className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-label font-semibold tabular-nums text-text-secondary"
          >
            {step}
          </span>
          <div className="min-w-0">
            <h2 className="text-title text-text-primary">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-body-sm text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </Card>
  );
}
