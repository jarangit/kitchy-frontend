import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface PageHeaderProps {
  /**
   * Route path to navigate on back. When provided, a back button is rendered.
   * Use `true` to navigate -1 in history.
   */
  backTo?: string | true;
  /** Optional custom label for the back button. Defaults to localized "Back". */
  backLabel?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned trailing content (buttons, filters, etc.) */
  action?: ReactNode;
  /** Extra content below the title row (e.g. tabs, stat strip). */
  children?: ReactNode;
  className?: string;
  /** Render as a sticky app-chrome header with backdrop blur. */
  sticky?: boolean;
}

/**
 * Shared page header for operational screens.
 * Calm, editorial anatomy: optional back → title (heading) → subtitle (quieter).
 * Trailing `action` slot for CTAs; optional `children` row for tabs/filters.
 */
export function PageHeader({
  backTo,
  backLabel,
  title,
  subtitle,
  action,
  children,
  className,
  sticky = false,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (backTo === true) {
      navigate(-1);
    } else if (typeof backTo === "string") {
      navigate(backTo);
    }
  };

  return (
    <header
      className={cn(
        sticky &&
          "sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur-xl",
        className,
      )}
    >
      <div className={cn("space-y-4", sticky && "px-4 py-4 sm:px-6")}>
        {backTo !== undefined && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <LuArrowLeft size={16} />
            <span>{backLabel ?? t("common.back")}</span>
          </Button>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h1 className="text-heading font-semibold text-text-primary tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-label text-text-tertiary">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>

        {children}
      </div>
    </header>
  );
}
