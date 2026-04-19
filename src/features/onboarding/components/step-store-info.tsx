import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useOnboarding } from "@/features/onboarding/context/onboarding-context";

interface Props {
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
}

export function StepStoreInfo({ onSubmit, submitting, error }: Props) {
  const { t } = useTranslation();
  const { draft, setStoreName, setPromptpay } = useOnboarding();

  const canSubmit = draft.storeName.trim().length > 0 && !submitting;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h1 className="mb-2 text-title text-text-primary tracking-tight">
          {t("onboarding.store.title")}
        </h1>
        <p className="text-body text-text-secondary">
          {t("onboarding.store.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label={t("onboarding.store.nameLabel")}
          placeholder={t("onboarding.store.namePlaceholder")}
          value={draft.storeName}
          onChange={(e) => setStoreName(e.target.value)}
          autoFocus
          maxLength={80}
        />

        <div>
          <Input
            label={t("onboarding.store.promptpayLabel")}
            placeholder={t("onboarding.store.promptpayPlaceholder")}
            value={draft.promptpay}
            onChange={(e) => setPromptpay(e.target.value)}
            inputMode="tel"
            maxLength={20}
          />
          <p className="mt-1 text-caption text-text-secondary">
            {t("onboarding.store.promptpayHint")}
          </p>
        </div>

        {error ? (
          <p className="text-caption text-danger">{error}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        loading={submitting}
      >
        {t("onboarding.common.next")}
      </Button>
    </form>
  );
}
