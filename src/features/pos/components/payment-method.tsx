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
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
            selected === method.value
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className={`mb-2 ${
              selected === method.value ? "text-black" : "text-gray-400"
            }`}
          >
            {method.icon}
          </div>
          <span
            className={`text-sm font-medium ${
              selected === method.value ? "text-black" : "text-gray-500"
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
