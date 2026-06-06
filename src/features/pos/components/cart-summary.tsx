import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  subtotal: number;
  totalItems: number;
}

const CartSummary = ({ subtotal, totalItems }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="py-0.5">
      <div className="flex items-center justify-between gap-3 text-title text-text-primary">
        <span className="text-body font-medium text-text-secondary">{t("pos.cart.total")}</span>
        <div className="flex items-center gap-2 tabular-nums">
          {totalItems > 0 && (
            <span className="text-label text-text-tertiary">({totalItems})</span>
          )}
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
