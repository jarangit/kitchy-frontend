import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

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
  const quickAmounts = [
    { label: `Exact ฿${subtotal.toLocaleString()}`, value: subtotal },
    { label: "฿500", value: 500 },
    { label: "฿1,000", value: 1000 },
  ];

  return (
    <div className="bg-surface rounded-radius-md border border-border p-6 mt-6">
      <h3 className="mb-4 text-title text-text-primary">Cash Payment</h3>
      <div className="space-y-4">
        <Input
          label="Received Amount"
          type="number"
          value={receivedAmount}
          onChange={(e) => onReceivedAmountChange(e.target.value)}
          placeholder="0.00"
          className="text-title"
        />

        <div>
          <p className="mb-2 text-label text-text-secondary">Quick amounts:</p>
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
          <p className="text-heading text-success">
            Change: ฿{change.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default CashPaymentSection;
