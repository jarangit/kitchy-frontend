import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { LuCheck } from "react-icons/lu";

interface OrderProduct {
  name?: string;
  quantity?: number;
  price?: number;
}

interface Props {
  order: {
    id: string;
    orderNumber: string;
    type?: string;
    orderType?: string;
    createdAt: string;
    totalAmount?: number;
    products?: OrderProduct[];
  };
  onClick: () => void;
  isLast?: boolean;
}

const ORDER_TYPE_KEY: Record<string, MessageKey> = {
  DINE_IN: "transaction.card.orderType.dineIn",
  TOGO: "transaction.card.orderType.togo",
  DELIVERY: "transaction.card.orderType.delivery",
};

const TransactionCard = ({ order, onClick, isLast = false }: Props) => {
  const { t } = useTranslation();
  const date = new Date(order.createdAt);
  const formattedTime = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalAmount =
    order.totalAmount ??
    (order.products?.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
      0
    ) ?? 0);

  const itemCount =
    order.products?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;

  const orderType = order.type ?? order.orderType;
  const orderTypeLabel = orderType && ORDER_TYPE_KEY[orderType]
    ? t(ORDER_TYPE_KEY[orderType])
    : orderType ?? t("transaction.card.orderType.default");

  const productSummary =
    order.products
      ?.slice(0, 2)
      .map(
        (item) =>
          `${item.name ?? t("transaction.card.productFallback")} x${item.quantity ?? 1}`,
      )
      .join("  |  ") ?? t("transaction.card.itemCount", { count: itemCount });

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full px-6 py-4 text-left transition-colors duration-[var(--motion-fast)] hover:bg-surface-hover",
        !isLast ? "border-b border-card-border" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg text-success">
            <LuCheck size={18} />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-heading font-semibold text-text-primary">
                {order.orderNumber}
              </p>
              <Badge variant="default">{orderTypeLabel}</Badge>
            </div>
            <p className="line-clamp-1 text-subtitle text-text-secondary">
              {productSummary}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-title font-semibold tabular-nums text-text-primary">
            ฿ {totalAmount.toLocaleString("th-TH", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-subtitle text-text-tertiary">{formattedTime}</p>
        </div>
      </div>
    </button>
  );
};

export default TransactionCard;
