import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import type { ICartItem } from "@/features/pos/types/pos.model";
import { Card } from "@/shared/components/ui/card";
import { ModifierSummary } from "@/shared/components/ui/modifier-summary";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  items: ICartItem[];
  subtotal: number;
  defaultExpanded?: boolean;
}

const OrderSummary = ({ items, subtotal, defaultExpanded = false }: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const toggleLabel = t(
    isExpanded ? "pos.payment.hideOrderItems" : "pos.payment.showOrderItems",
    { count: String(totalItems) },
  );

  const content = (
    <>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="grid grid-cols-[1fr_auto_auto] items-baseline gap-2 py-2.5 text-body text-text-secondary"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">
                {item.name}
              </p>
              {item.selections.length > 0 && (
                <ModifierSummary selections={item.selections} />
              )}
              {item.note && (
                <p className="mt-0.5 truncate text-caption leading-5 text-text-tertiary">
                  {t("pos.receipt.note", { note: item.note })}
                </p>
              )}
            </div>
            <span className="shrink-0 text-body-sm tabular-nums">
              x{item.quantity}
            </span>
            <span className="w-20 shrink-0 text-right tabular-nums text-text-primary">
              ฿{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-title">
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
          <p className="text-body font-semibold text-text-primary">
            {toggleLabel}
          </p>
          <p className="mt-1 text-body-sm tabular-nums text-text-secondary">
            {t("pos.receipt.total")} ฿{subtotal.toFixed(2)}
          </p>
        </div>
        {isExpanded ? (
          <LuChevronUp
            className="h-5 w-5 shrink-0 text-text-tertiary"
            aria-hidden="true"
          />
        ) : (
          <LuChevronDown
            className="h-5 w-5 shrink-0 text-text-tertiary"
            aria-hidden="true"
          />
        )}
      </button>

      <div className="hidden md:block">
        <h3 className="mb-4 text-title text-text-primary">
          {t("pos.payment.orderSummary")}
        </h3>
        {content}
      </div>

      {isExpanded && <div className="mt-4 md:hidden">{content}</div>}
    </Card>
  );
};

export default OrderSummary;
