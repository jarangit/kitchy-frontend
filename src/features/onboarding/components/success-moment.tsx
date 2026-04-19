import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  amount: number;
  onClose: () => void;
}

/**
 * Full-screen celebration modal rendered after the first order is placed
 * during an onboarding session. Portaled to <body> so POS page structure
 * doesn't interfere with z-index.
 */
export function SuccessMoment({ amount, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: storeId } = useParams<{ id: string }>();

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-dialog-overlay px-6"
      role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-card bg-card-bg border border-card-border p-8 text-center shadow-xl">
        <div className="mb-4 text-[56px] leading-none">🎉</div>
        <h2 className="mb-2 text-heading text-text-primary tracking-tight">
          {t("onboarding.success.title")}
        </h2>
        <p className="mb-2 text-body text-text-secondary">
          {t("onboarding.success.subtitle")}
        </p>
        <p className="mb-8 text-title text-text-primary tabular-nums">
          {t("onboarding.success.amount", { amount: amount.toFixed(2) })}
        </p>

        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={onClose}>
            {t("onboarding.success.sellMore")}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              onClose();
              if (storeId) navigate(`/store/${storeId}/report`);
            }}
          >
            {t("onboarding.success.viewReport")}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
