import { LuQrCode } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  subtotal: number;
  className?: string;
}

const QrPaymentSection = ({ subtotal, className }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cn("mt-6 rounded-card border border-card-border bg-card-bg p-card-padding text-center", className)}>
      <h3 className="mb-6 text-title text-text-primary">
        {t("pos.payment.qrTitle")}
      </h3>
      <div className="mx-auto flex h-60 w-full max-w-[15rem] flex-col items-center justify-center gap-4 rounded-card border border-border px-4 text-text-tertiary">
        <LuQrCode size={48} />
        <span className="text-body-sm">{t("pos.payment.qrPlaceholder")}</span>
      </div>
      <p className="mt-5 break-words text-body text-text-secondary tabular-nums">
        {t("pos.payment.scanToPay", { amount: `฿${subtotal.toFixed(2)}` })}
      </p>
    </div>
  );
};

export default QrPaymentSection;
