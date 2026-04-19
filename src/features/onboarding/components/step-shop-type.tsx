import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { useOnboarding } from "@/features/onboarding/context/onboarding-context";
import type { OnboardingShopType } from "@/features/onboarding/types/onboarding.model";

interface Props {
  onSubmit: () => void;
}

interface Option {
  value: OnboardingShopType;
  emoji: string;
  labelKey:
    | "onboarding.shopType.dineIn"
    | "onboarding.shopType.togo"
    | "onboarding.shopType.delivery";
}

const OPTIONS: Option[] = [
  { value: "DINE_IN", emoji: "🪑", labelKey: "onboarding.shopType.dineIn" },
  { value: "TOGO", emoji: "🛍️", labelKey: "onboarding.shopType.togo" },
  { value: "DELIVERY", emoji: "🏍️", labelKey: "onboarding.shopType.delivery" },
];

export function StepShopType({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { draft, setShopType } = useOnboarding();

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="mb-2 text-title text-text-primary tracking-tight">
          {t("onboarding.shopType.title")}
        </h1>
        <p className="text-body text-text-secondary">
          {t("onboarding.shopType.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const selected = draft.shopType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setShopType(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border p-5",
                "transition-colors duration-[var(--motion-fast)]",
                "text-body text-text-primary",
                selected
                  ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                  : "border-card-border bg-card-bg hover:bg-card-bg-hover",
              )}
              aria-pressed={selected}
            >
              <span className="text-[32px]">{opt.emoji}</span>
              <span className="text-center">{t(opt.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <Button size="lg" onClick={onSubmit}>
        {t("onboarding.common.next")}
      </Button>
    </div>
  );
}
