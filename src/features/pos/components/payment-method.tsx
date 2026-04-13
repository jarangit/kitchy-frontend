import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { LuBanknote, LuQrCode, LuArrowRightLeft } from "react-icons/lu";

interface Props {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const methods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "CASH", label: "Cash", icon: <LuBanknote size={28} /> },
  { value: "QR", label: "QR Code", icon: <LuQrCode size={28} /> },
  { value: "TRANSFER", label: "Transfer", icon: <LuArrowRightLeft size={28} /> },
];

const PaymentMethodSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {methods.map((method) => (
        <button
          key={method.value}
          onClick={() => onSelect(method.value)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
            selected === method.value
              ? "border-[var(--color-text-primary)] bg-[var(--color-surface)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
          }`}
        >
          <div
            className={`mb-2 ${
              selected === method.value ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"
            }`}
          >
            {method.icon}
          </div>
          <span
            className={`text-sm font-medium ${
              selected === method.value ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
            }`}
          >
            {method.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
