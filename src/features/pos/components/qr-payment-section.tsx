import { LuQrCode, LuSettings2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { ThaiQrIcon } from "@/shared/assets/thai-qr-marks";

interface Props {
  subtotal: number;
  qrDataUrl?: string | null;
  promptpayId?: string | null;
  className?: string;
  embedded?: boolean;
}

const formatPromptPayId = (id: string) => {
  const digits = id.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13) {
    return digits.replace(
      /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
      "$1-$2-$3-$4-$5",
    );
  }
  return id;
};

const maskPromptPayId = (id: string) => {
  const formatted = formatPromptPayId(id);
  if (formatted.includes("-")) {
    const parts = formatted.split("-");
    return parts
      .map((part, idx) => (idx < parts.length - 1 ? "xxx" : part))
      .join("-");
  }
  if (id.length > 4)
    return `${"•".repeat(Math.max(0, id.length - 4))}${id.slice(-4)}`;
  return id;
};

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

  const amountLabel = `฿${subtotal.toFixed(2)}`;

  const card = (
    <div className="overflow-hidden rounded-card border border-border bg-card-bg text-center shadow-sm">
      <div className="bg-[#00427a] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#ffffff]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-[#ffffff] p-1">
              <ThaiQrIcon className="h-5 w-5" title="Thai QR Payment" />
            </span>
            <span className="text-left leading-none">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#ffffff]/90">
                Thai QR Payment
              </span>
              <span className="block text-caption font-medium text-[#ffffff]">
                PromptPay
              </span>
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-[#ffffff]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#ffffff]">
            {t("pos.payment.qrTitle")}
          </span>
        </div>
      </div>

      <div className="px-6 pt-5">
        <p className="text-caption font-medium uppercase tracking-widest text-text-tertiary">
          {t("pos.payment.amountDue")}
        </p>
        <p className="mt-1 font-mono text-display font-bold leading-none tabular-nums text-text-primary">
          {amountLabel}
        </p>
        {promptpayId && (
          <p className="mt-2 text-caption text-text-secondary">
            {t("pos.payment.promptpayReceiver", {
              id: maskPromptPayId(promptpayId),
            })}
          </p>
        )}
      </div>

      <div className="mx-auto mt-5 flex justify-center px-6">
        {qrDataUrl ? (
          <div className="relative rounded-card bg-[#ffffff] p-3 shadow-sm ring-1 ring-border">
            <img
              src={qrDataUrl}
              alt={t("pos.payment.qrTitle")}
              className="h-56 w-56 object-contain sm:h-64 sm:w-64"
            />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <ThaiQrIcon
                className="h-8 w-8 opacity-50 sm:h-9 sm:w-9"
                title="Thai QR"
              />
            </span>
          </div>
        ) : (
          <div className="flex h-56 w-full max-w-[18rem] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-surface px-4 text-text-tertiary sm:h-64 sm:max-w-[20rem]">
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
      </div>

      <div className="mx-auto max-w-sm space-y-1 px-6 pb-6 pt-4">
        <p className="text-body-sm font-medium text-text-primary">
          {t("pos.payment.scanHint")}
        </p>
        <p className="text-body-sm leading-6 text-text-secondary">
          {t("pos.payment.qrConfirmHint")}
        </p>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="mx-auto w-full max-w-sm">{card}</div>;
  }

  return (
    <Card className={cn("mx-auto mt-6 w-full max-w-sm p-0", className)}>
      {card}
    </Card>
  );
};

export default QrPaymentSection;
