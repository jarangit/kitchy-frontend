import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  subtotal: number;
  receivedAmount: string;
  onReceivedAmountChange: (value: string) => void;
  change: number;
  className?: string;
  embedded?: boolean;
}

const CashPaymentSection = ({
  subtotal,
  receivedAmount,
  onReceivedAmountChange,
  change,
  className,
  embedded = false,
}: Props) => {
  const { t } = useTranslation();
  const quickAmounts = [
    {
      label: t("pos.payment.exactAmount", {
        amount: `฿${subtotal.toLocaleString()}`,
      }),
      value: subtotal,
    },
    { label: "฿500", value: 500 },
    { label: "฿1,000", value: 1000 },
  ];

  const content = (
    <>
      <h3 className="text-title text-text-primary">
        {t("pos.payment.cashTitle")}
      </h3>
      <div className={embedded ? "space-y-4" : "space-y-5"}>
        <Input
          label={t("pos.payment.receivedAmount")}
          type="number"
          value={receivedAmount}
          onChange={(e) => onReceivedAmountChange(e.target.value)}
          placeholder="0.00"
          className="text-title tabular-nums"
        />

        <div>
          <p className="mb-2 text-label text-text-secondary">
            {t("pos.payment.quickAmounts")}
          </p>
          <div className="flex flex-wrap gap-3">
            {quickAmounts.map((amt) => (
              <Button
                key={amt.value}
                variant="secondary"
                size="sm"
                onClick={() => onReceivedAmountChange(String(amt.value))}
                className="whitespace-normal text-center"
              >
                {amt.label}
              </Button>
            ))}
          </div>
        </div>

        {Number(receivedAmount) > 0 && (
          <p className="break-words text-display tabular-nums text-success">
            {t("pos.payment.change", { amount: `฿${change.toFixed(2)}` })}
          </p>
        )}
      </div>
    </>
  );

  if (embedded) {
    return <div className={cn("space-y-4", className)}>{content}</div>;
  }

  return <Card className={cn("mt-6 space-y-5", className)}>{content}</Card>;
};

export default CashPaymentSection;
