import { LuBike, LuCheck, LuPackage, LuUtensilsCrossed } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import type { ReadyToServeItem } from "@/features/kds/hooks/use-ready-to-serve";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import type { OrderType } from "@/features/pos/types/pos.model";
import { cn } from "@/shared/utils/cn";
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";

const getItemContext = (item: ReadyToServeItem) => {
  if (item.orderType === "DINE_IN" && item.tableNumber) {
    return `Table ${item.tableNumber}`;
  }
  if (item.orderType === "DELIVERY") {
    return item.deliveryPlatform ?? "Delivery";
  }
  return `#${item.orderNumber}`;
};

const getWaitingMinutes = (createdAt: string) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

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

interface Props {
  items: ReadyToServeItem[];
  servingIds: Set<string>;
  onServed: (item: ReadyToServeItem) => void;
  onOpenKds?: () => void;
}

export function ReadyToServeGrid({ items, servingIds, onServed }: Props) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-title text-text-primary">{t("serve.empty.title")}</p>
        <p className="mt-1 text-body-sm text-text-secondary">
          {t("serve.empty.body")}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 2xl:grid-cols-4 2xl:gap-6">
      {items.map((item) => {
        const orderType = item.orderType as OrderType | undefined;
        const strategy = orderType ? getOrderTypeStrategy(orderType) : null;
        const typeLabel = strategy
          ? orderType === "DELIVERY" && item.deliveryPlatform?.trim()
            ? item.deliveryPlatform.trim()
            : t(strategy.labelKey as MessageKey)
          : null;
        const OrderTypeIcon = orderType
          ? ORDER_TYPE_ICONS[orderType]
          : LuUtensilsCrossed;
        const brand =
          orderType === "DELIVERY"
            ? getDeliveryPlatformBrand(item.deliveryPlatform ?? "")
            : null;
        const waitingMinutes = getWaitingMinutes(item.createdAt);
        const isOverdue = waitingMinutes >= 15;

        return (
          <Card
            as="article"
            key={item.id}
            padding="none"
            className="flex flex-col px-5 py-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              {typeLabel && orderType ? (
                <Badge
                  size="sm"
                  className={cn(
                    "gap-1.5 border text-label font-semibold",
                    !brand && ORDER_TYPE_BADGE_STYLES[orderType],
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
                  <OrderTypeIcon size={12} className="shrink-0" />
                  {typeLabel}
                </Badge>
              ) : (
                <span aria-hidden="true" />
              )}
              <Badge
                variant={isOverdue ? "danger" : "warning"}
                size="sm"
                className={cn(
                  "shrink-0",
                  isOverdue &&
                    "border-danger bg-danger text-on-status shadow-sm",
                )}
              >
                {t("serve.item.waiting", {
                  minutes: String(waitingMinutes),
                })}
              </Badge>
            </div>

            <div className="mb-4">
              <p className="truncate text-display font-bold leading-none tracking-tight text-text-primary">
                {getItemContext(item)}
              </p>
            </div>

            <InsetPanel className="mb-4 rounded-card px-4 py-3">
              <p className="truncate text-body font-medium text-text-primary">
                {item.productName} x{item.quantity}
              </p>
              {item.note && (
                <p className="mt-1 truncate text-body-sm text-text-secondary">
                  {item.note}
                </p>
              )}
            </InsetPanel>

            <div className="mt-auto pt-2">
              <Button
                size="md"
                className="w-full"
                onClick={() => onServed(item)}
                disabled={servingIds.has(item.id)}
              >
                <LuCheck size={16} />
                {servingIds.has(item.id)
                  ? t("serve.action.serving")
                  : t("serve.action.served")}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
