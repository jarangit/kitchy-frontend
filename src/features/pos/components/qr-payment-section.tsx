import { LuQrCode } from "react-icons/lu";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  subtotal: number;
  className?: string;
  embedded?: boolean;
}

const QrPaymentSection = ({ subtotal, className, embedded = false }: Props) => {
  const { t } = useTranslation();

  const content = (
    <>
      <h3 className="text-title text-text-primary">
        {t("pos.payment.qrTitle")}
      </h3>
      <div className="mx-auto flex h-60 w-full max-w-[15rem] flex-col items-center justify-center gap-4 rounded-card border border-border px-4 text-text-tertiary">
        <LuQrCode size={48} />
        <span className="text-body-sm">{t("pos.payment.qrPlaceholder")}</span>
      </div>
      <p className="break-words text-body text-text-secondary tabular-nums">
        {t("pos.payment.scanToPay", { amount: `฿${subtotal.toFixed(2)}` })}
      </p>
    </>
  );

  if (embedded) {
    return <div className={cn("space-y-4 text-center", className)}>{content}</div>;
  }

  return <Card className={cn("mt-6 space-y-4 text-center", className)}>{content}</Card>;
};

export default QrPaymentSection;
