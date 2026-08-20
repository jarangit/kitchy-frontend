import { LuQrCode, LuSettings2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  subtotal: number;
  qrDataUrl?: string | null;
  promptpayId?: string | null;
  className?: string;
  embedded?: boolean;
}

const QrPaymentSection = ({
  subtotal,
  qrDataUrl,
  promptpayId,
  className,
  embedded = false,
}: Props) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const showConfigure = !qrDataUrl && !promptpayId;
  const hintLabel = showConfigure
    ? t("pos.payment.qrNotConfigured")
    : t("pos.payment.qrUnavailable");

  const content = (
    <>
      <h3 className="text-title text-text-primary">
        {t("pos.payment.qrTitle")}
      </h3>
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt={t("pos.payment.qrTitle")}
          className="mx-auto h-48 w-48 rounded-card border border-border bg-surface sm:h-56 sm:w-56"
        />
      ) : (
        <div className="mx-auto flex h-48 w-full max-w-[13rem] flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface px-4 text-text-tertiary sm:h-56 sm:max-w-[15rem]">
          <LuQrCode size={48} />
          <span className="text-center text-body-sm">{hintLabel}</span>
          {showConfigure && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/store/${id}/settings/store`)}
            >
              <LuSettings2 size={16} />
              {t("pos.payment.goConfigure")}
            </Button>
          )}
        </div>
      )}
      <div className="mx-auto max-w-sm space-y-2">
        <p className="break-words text-body font-semibold text-text-primary tabular-nums">
          {t("pos.payment.scanToPay", { amount: `฿${subtotal.toFixed(2)}` })}
        </p>
        <p className="text-body-sm leading-6 text-text-secondary">
          {t("pos.payment.qrConfirmHint")}
        </p>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className={cn("space-y-4 text-center", className)}>{content}</div>
    );
  }

  return (
    <Card className={cn("mt-6 space-y-4 text-center", className)}>
      {content}
    </Card>
  );
};

export default QrPaymentSection;
