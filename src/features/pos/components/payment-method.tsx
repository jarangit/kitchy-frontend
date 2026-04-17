import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { LuBanknote, LuQrCode } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

interface Props {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const methods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "CASH", label: "Cash", icon: <LuBanknote size={28} /> },
  { value: "QR", label: "QR Code", icon: <LuQrCode size={28} /> },
];

const PaymentMethodSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((method) => (
        <button
          key={method.value}
          onClick={() => onSelect(method.value)}
          className={cn(
            "flex min-h-28 flex-col items-center justify-center rounded-radius-md border p-4 transition-all duration-[var(--motion-fast)] ",
            selected === method.value
              ? "border-primary bg-surface"
              : "border-border hover:border-border-hover"
          )}
        >
          <div
            className={cn(
              "mb-2",
              selected === method.value ? "text-text-primary" : "text-text-tertiary"
            )}
          >
            {method.icon}
          </div>
          <span
            className={cn(
              "text-body font-[var(--weight-medium)]",
              selected === method.value ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {method.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
