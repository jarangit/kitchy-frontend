import { LuQrCode } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  subtotal: number;
}

const QrPaymentSection = ({ subtotal }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 rounded-card border border-card-border bg-card-bg p-card-padding text-center">
      <h3 className="mb-6 text-title text-text-primary">
        {t("pos.payment.qrTitle")}
      </h3>
      <div className="mx-auto flex h-52 w-52 flex-col items-center justify-center gap-3 rounded-card border border-border text-text-tertiary">
        <LuQrCode size={48} />
        <span className="text-body-sm">{t("pos.payment.qrPlaceholder")}</span>
      </div>
      <p className="mt-4 text-label text-text-secondary tabular-nums">
        {t("pos.payment.scanToPay", { amount: `฿${subtotal.toFixed(2)}` })}
      </p>
    </div>
  );
};

export default QrPaymentSection;
