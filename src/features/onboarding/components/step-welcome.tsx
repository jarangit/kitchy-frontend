import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  onStart: () => void;
}

export function StepWelcome({ onStart }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-[40px]">
        🍳
      </div>

      <h1 className="mb-3 text-heading text-text-primary tracking-tight">
        {t("onboarding.welcome.title")}
      </h1>
      <p className="mb-10 text-body text-text-secondary">
        {t("onboarding.welcome.subtitle")}
      </p>

      <Button size="lg" onClick={onStart} className="min-w-[200px]">
        {t("onboarding.welcome.cta")}
      </Button>
    </div>
  );
}
