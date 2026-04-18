import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { cn } from "@/shared/utils/cn";

export type FlowStatus = "IN_PROGRESS" | "DONE" | "CANCELLED";

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
  flowStatus: FlowStatus;
  onClick: () => void;
  onQuickAction?: (action: "READY" | "CANCELLED") => void;
  isLast?: boolean;
  isPending?: boolean;
}

const ORDER_TYPE_KEY: Record<string, MessageKey> = {
  DINE_IN: "transaction.card.orderType.dineIn",
  TOGO: "transaction.card.orderType.togo",
  DELIVERY: "transaction.card.orderType.delivery",
};

const DOT_CLASS: Record<FlowStatus, string> = {
  IN_PROGRESS: "bg-accent",
  DONE: "bg-success",
  CANCELLED: "bg-border",
};

const TransactionCard = ({
  order,
  flowStatus,
  onClick,
  onQuickAction,
  isLast = false,
  isPending = false,
}: Props) => {
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
      0,
    ) ?? 0);

  const itemCount =
    order.products?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;
  const productCount = order.products?.length ?? 0;

  const orderType = order.type ?? order.orderType;
  const orderTypeLabel =
    orderType && ORDER_TYPE_KEY[orderType]
      ? t(ORDER_TYPE_KEY[orderType])
      : orderType ?? t("transaction.card.orderType.default");

  const summaryLine =
    productCount > 0
      ? t("transaction.list.itemsSuffix", {
          items: itemCount,
          products: productCount,
        })
      : t("transaction.card.itemCount", { count: itemCount });

  const handleQuickAction = (
    e: React.MouseEvent,
    action: "READY" | "CANCELLED",
  ) => {
    e.stopPropagation();
    onQuickAction?.(action);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-full px-5 py-4 text-left transition-colors duration-[var(--motion-fast)]",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "cursor-pointer",
        !isLast && "border-b border-card-border",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className={cn(
              "mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full",
              DOT_CLASS[flowStatus],
              flowStatus === "IN_PROGRESS" && "animate-pulse",
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-body font-semibold text-text-primary">
                {order.orderNumber}
              </p>
              <Badge variant="default">{orderTypeLabel}</Badge>
            </div>
            <p className="mt-0.5 line-clamp-1 text-caption text-text-tertiary">
              {summaryLine}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-title font-semibold tabular-nums text-text-primary">
            ฿{totalAmount.toLocaleString("th-TH", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-caption text-text-tertiary tabular-nums">
            {formattedTime}
          </p>
        </div>
      </div>

      {flowStatus === "IN_PROGRESS" && onQuickAction && (
        <div className="mt-3 flex gap-2 pl-5">
          <Button
            size="sm"
            onClick={(e) => handleQuickAction(e, "READY")}
            disabled={isPending}
          >
            {t("transaction.list.quickAction.markReady")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => handleQuickAction(e, "CANCELLED")}
            disabled={isPending}
            className="text-danger hover:text-danger"
          >
            {t("transaction.list.quickAction.cancel")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
