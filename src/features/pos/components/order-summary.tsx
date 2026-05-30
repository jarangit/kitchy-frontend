import type { ICartItem } from "@/features/pos/types/pos.model";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-card border border-card-border bg-card-bg p-card-padding">
      <h3 className="mb-5 text-title text-text-primary">
        {t("pos.payment.orderSummary")}
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between gap-4 text-body text-text-secondary"
          >
            <div>
              <span>
                {item.name} x{item.quantity}
              </span>
              {item.note && (
                <p className="mt-1 text-body leading-6 text-text-tertiary">
                  {t("pos.receipt.note", { note: item.note })}
                </p>
              )}
            </div>
            <span>฿{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between border-t border-border pt-5 text-title">
        <span>{t("pos.receipt.total")}</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
