import { Link } from "react-router-dom";
import {
  LuBike,
  LuChevronRight,
  LuPackage,
  LuUtensilsCrossed,
} from "react-icons/lu";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import type { OrderType } from "@/features/pos/types/pos.model";
import { cn } from "@/shared/utils/cn";
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";

type QueueOrder = {
  orderNumber: string;
  createdAt: string;
  orderType?: OrderType;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  count: number;
};

type Props = {
  kitchenPending: QueueOrder[];
  readyToServe: QueueOrder[];
  storeId?: string;
  elapsedMinutesLabel: (iso?: string) => number;
};

const MAX_VISIBLE_ORDERS = 5;

const ORDER_TYPE_BADGE_STYLES: Record<OrderType, string> = {
  DINE_IN: "border-success bg-success text-on-status",
  TOGO: "border-warning bg-warning text-on-status",
  DELIVERY: "border-info bg-info text-on-status",
};

const ORDER_TYPE_ICONS: Record<OrderType, typeof LuUtensilsCrossed> = {
  DINE_IN: LuUtensilsCrossed,
  TOGO: LuPackage,
  DELIVERY: LuBike,
};

function QueueOrderRow({
  order,
  elapsedMinutesLabel,
}: {
  order: QueueOrder;
  elapsedMinutesLabel: (iso?: string) => number;
}) {
  const { t } = useTranslation();
  const strategy = order.orderType
    ? getOrderTypeStrategy(order.orderType)
    : null;
  const typeLabel = strategy
    ? order.orderType === "DELIVERY" && order.deliveryPlatform?.trim()
      ? order.deliveryPlatform.trim()
      : t(strategy.labelKey as MessageKey)
    : null;
  const OrderTypeIcon = order.orderType
    ? ORDER_TYPE_ICONS[order.orderType]
    : LuUtensilsCrossed;
  const brand =
    order.orderType === "DELIVERY"
      ? getDeliveryPlatformBrand(order.deliveryPlatform ?? "")
      : null;
  const displayOrderNumber =
    order.orderType === "DELIVERY" && order.deliveryOrderNumber
      ? order.deliveryOrderNumber
      : order.orderNumber;

  return (
    <div className="rounded-card bg-bg px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-title font-semibold tracking-tight text-text-primary">
          #{displayOrderNumber}
        </p>
        {typeLabel && order.orderType ? (
          <Badge
            size="sm"
            className={cn(
              "shrink-0 gap-1.5 border text-label font-semibold",
              !brand && ORDER_TYPE_BADGE_STYLES[order.orderType],
            )}
            style={
              brand
                ? {
                    backgroundColor: brand.brandColor,
                    color: brand.onColor,
                    borderColor: brand.brandColor,
                  }
                : undefined
            }
          >
            <OrderTypeIcon size={14} className="shrink-0" />
            {typeLabel}
          </Badge>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
      <p className="mt-1 text-body-sm text-text-secondary">
        {t("dashboard.operations.minutesAgo", {
          count: elapsedMinutesLabel(order.createdAt),
        })}{" "}
        · {t("dashboard.operations.itemCount", { count: order.count })}
      </p>
    </div>
  );
}

function QueueColumn({
  title,
  emptyTitle,
  actionLabel,
  actionTo,
  orders,
  elapsedMinutesLabel,
}: {
  title: string;
  emptyTitle: string;
  actionLabel: string;
  actionTo?: string;
  orders: QueueOrder[];
  elapsedMinutesLabel: (iso?: string) => number;
}) {
  const visibleOrders = orders.slice(0, MAX_VISIBLE_ORDERS);

  return (
    <Card className="flex min-h-80 flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-title font-semibold tracking-tight text-text-primary">
            {title}
          </h3>
        </div>
        <p className="shrink-0 text-body-sm font-medium tabular-nums text-text-secondary">
          {orders.length}
        </p>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {visibleOrders.length > 0 ? (
          visibleOrders.map((order) => (
            <QueueOrderRow
              key={order.orderNumber}
              order={order}
              elapsedMinutesLabel={elapsedMinutesLabel}
            />
          ))
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-card bg-bg px-4 py-8 text-center">
            <p className="text-body-sm font-medium text-text-secondary">
              {emptyTitle}
            </p>
          </div>
        )}
      </div>

      {actionTo ? (
        <Link
          to={actionTo}
          className="mt-4 inline-flex items-center gap-1 self-start rounded-full px-1 py-1 text-body-sm font-medium text-info transition-colors duration-fast hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <span>{actionLabel}</span>
          <LuChevronRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </Card>
  );
}

export function DashboardOrderQueueSection({
  kitchenPending,
  readyToServe,
  storeId,
  elapsedMinutesLabel,
}: Props) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-heading font-semibold tracking-tight text-text-primary">
          {t("dashboard.queue.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <QueueColumn
          title={t("dashboard.queue.pending.title")}
          emptyTitle={t("dashboard.queue.pending.emptyTitle")}
          actionLabel={t("dashboard.queue.pending.action")}
          actionTo={storeId ? `/store/${storeId}/kds` : undefined}
          orders={kitchenPending}
          elapsedMinutesLabel={elapsedMinutesLabel}
        />
        <QueueColumn
          title={t("dashboard.queue.ready.title")}
          emptyTitle={t("dashboard.queue.ready.emptyTitle")}
          actionLabel={t("dashboard.queue.ready.action")}
          actionTo={storeId ? `/store/${storeId}/ready-to-serve` : undefined}
          orders={readyToServe}
          elapsedMinutesLabel={elapsedMinutesLabel}
        />
      </div>
    </section>
  );
}
