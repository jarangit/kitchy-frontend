import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SettingsFrame } from "./settings-frame";

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
    <SettingsFrame>
      <div className="w-full space-y-6 lg:space-y-8">
        <div className="space-y-4">
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

          <Card className="space-y-2">
            <h1 className="text-heading leading-tight text-text-primary sm:text-display">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-body-sm leading-7 text-text-secondary">
                {description}
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-5 lg:space-y-6">{children}</div>
      </div>
    </SettingsFrame>
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
    <Card as="section">
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
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
    </Card>
  );
};
