import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Section header used at the top of each Settings Control Panel section.
 * Owns the "where am I" moment so the page no longer needs a separate page title.
 */
export function SettingsSectionHeader({
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h2 className="text-heading leading-tight text-text-primary sm:text-display">
          {title}
        </h2>
        {description && (
          <p className="max-w-prose text-body-sm leading-6 text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
