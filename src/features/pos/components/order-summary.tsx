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
            className="flex flex-col gap-2 text-body text-text-secondary sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <span>
                {item.name} x{item.quantity}
              </span>
              {item.note && (
                <p className="mt-1 text-body leading-6 text-text-tertiary">
                  {t("pos.receipt.note", { note: item.note })}
                </p>
              )}
            </div>
            <span className="shrink-0 tabular-nums text-text-primary sm:text-right">
              ฿{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-title">
        <span>{t("pos.receipt.total")}</span>
        <span className="tabular-nums">฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
