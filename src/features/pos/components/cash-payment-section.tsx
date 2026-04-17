import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  subtotal: number;
  receivedAmount: string;
  onReceivedAmountChange: (value: string) => void;
  change: number;
}

const CashPaymentSection = ({
  subtotal,
  receivedAmount,
  onReceivedAmountChange,
  change,
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

  return (
    <div className="mt-6 rounded-card border border-card-border bg-card-bg p-card-padding">
      <h3 className="mb-4 text-title text-text-primary">
        {t("pos.payment.cashTitle")}
      </h3>
      <div className="space-y-4">
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
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt.value}
                variant="secondary"
                size="sm"
                onClick={() => onReceivedAmountChange(String(amt.value))}
              >
                {amt.label}
              </Button>
            ))}
          </div>
        </div>

        {Number(receivedAmount) > 0 && (
          <p className="text-heading tabular-nums text-success">
            {t("pos.payment.change", { amount: `฿${change.toFixed(2)}` })}
          </p>
        )}
      </div>
    </div>
  );
};

export default CashPaymentSection;
