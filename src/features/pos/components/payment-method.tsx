import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { LuBanknote, LuQrCode } from "react-icons/lu";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  compact?: boolean;
  ariaLabel?: string;
}

const PaymentMethodSelector = ({ selected, onSelect, compact = false, ariaLabel }: Props) => {
  const { t } = useTranslation();

  const methods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: "CASH", label: t("pos.payment.cash"), icon: <LuBanknote size={22} /> },
    { value: "QR", label: t("pos.payment.qr"), icon: <LuQrCode size={22} /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label={ariaLabel} role="group">
      {methods.map((method) => (
        <SelectionChip
          key={method.value}
          active={selected === method.value}
          onClick={() => onSelect(method.value)}
          className={compact ? "min-h-[72px] gap-2 py-3 text-center" : "min-h-[120px] flex-col gap-3 py-5 text-center"}
        >
          <span aria-hidden="true">{method.icon}</span>
          <span>{method.label}</span>
        </SelectionChip>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
