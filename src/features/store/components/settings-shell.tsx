import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface SettingsShellProps {
  title: string;
  description?: string;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
}

export const SettingsShell = ({
  title,
  description,
  onBack,
  backLabel = "Back to Settings",
  children,
}: SettingsShellProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-8 lg:space-y-10">
      <div className="space-y-5">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="px-1 text-text-secondary hover:text-text-primary"
          >
            <LuArrowLeft size={16} />
            {backLabel ?? t("common.backToSettings")}
          </Button>
        )}

        <div className="space-y-3 rounded-card border border-card-border bg-card-bg p-card-padding">
          <h1 className="text-heading leading-tight text-text-primary sm:text-display">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-body-sm leading-7 text-text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6 lg:space-y-7">{children}</div>
    </div>
  );
};

interface SettingsSectionCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SettingsSectionCard = ({
  title,
  description,
  action,
  children,
}: SettingsSectionCardProps) => {
  return (
    <section className="rounded-card border border-card-border bg-card-bg p-card-padding">
      {(title || description || action) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            {title && (
              <h2 className="text-subtitle text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-2xl text-body-sm leading-7 text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}

      {children}
    </section>
  );
};
