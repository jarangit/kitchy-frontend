import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import type { ICartItem } from "@/features/pos/types/pos.model";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const toggleLabel = t(
    isExpanded ? "pos.payment.hideOrderItems" : "pos.payment.showOrderItems",
    { count: String(totalItems) },
  );

  const content = (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
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
    </>
  );

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left md:hidden"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <div>
          <p className="text-body font-semibold text-text-primary">{toggleLabel}</p>
          <p className="mt-1 text-body-sm tabular-nums text-text-secondary">
            {t("pos.receipt.total")} ฿{subtotal.toFixed(2)}
          </p>
        </div>
        {isExpanded ? (
          <LuChevronUp className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden="true" />
        ) : (
          <LuChevronDown className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden="true" />
        )}
      </button>

      <div className="hidden md:block">
        <h3 className="mb-5 text-title text-text-primary">
          {t("pos.payment.orderSummary")}
        </h3>
        {content}
      </div>

      {isExpanded && <div className="mt-5 md:hidden">{content}</div>}
    </Card>
  );
};

export default OrderSummary;
