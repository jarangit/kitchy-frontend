import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

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
  return (
    <div className="w-full space-y-8 lg:space-y-10">
      <div className="space-y-5">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 px-1 text-sm text-[var(--color-text-secondary)] transition-all duration-[var(--motion-fast)] hover:text-[var(--color-text-primary)] active:scale-[0.98]"
          >
            <LuArrowLeft size={16} />
            {backLabel}
          </button>
        )}

        <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-7 sm:px-7 sm:py-8">
          <h1 className="text-2xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
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
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-7 sm:px-7 sm:py-8">
      {(title || description || action) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            {title && (
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
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
