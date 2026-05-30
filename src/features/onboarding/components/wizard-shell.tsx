import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { ProgressDots } from "./progress-dots";

interface Props {
  /** 1-based current step index for the progress dots. */
  stepIndex: number;
  totalSteps: number;
  /** Optional back handler. Hidden if omitted. */
  onBack?: () => void;
  /** Optional skip handler. Hidden if omitted. */
  onSkip?: () => void;
  children: ReactNode;
}

/**
 * Full-screen wizard chrome: top bar (back/skip), centered slot, footer dots.
 *
 * The slot is scrollable so long forms (e.g. many menus) stay usable on small
 * viewports. Intentionally minimal — steps bring their own primary CTA.
 */
export function WizardShell({
  stepIndex,
  totalSteps,
  onBack,
  onSkip,
  children,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border/60 bg-bg/95 px-5 backdrop-blur-xl">
        <div className="w-28">
          {onBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-1.5"
            >
              <LuArrowLeft size={16} />
              {t("onboarding.common.back")}
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-caption text-text-secondary">
            {t("onboarding.progress.step", {
              current: stepIndex,
              total: totalSteps,
            })}
          </span>
        </div>

        <div className="flex w-28 justify-end">
          {onSkip ? (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              {t("onboarding.common.skip")}
            </Button>
          ) : null}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="flex h-16 items-center justify-center border-t border-border/60 bg-bg/95 backdrop-blur-xl">
        <ProgressDots total={totalSteps} current={stepIndex} />
      </footer>
    </div>
  );
}
