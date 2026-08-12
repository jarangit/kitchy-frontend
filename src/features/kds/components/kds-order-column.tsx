import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LuBike,
  LuCheck,
  LuClock3,
  LuPackage,
  LuUtensilsCrossed,
} from "react-icons/lu";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";
import { cn } from "@/shared/utils/cn";
import type { OrderType } from "@/features/pos/types/pos.model";

const ELAPSED_TICK_MS = 30_000;

const useElapsedMinutes = (iso: string) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ELAPSED_TICK_MS);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, (now - new Date(iso).getTime()) / 60000);
};

const formatElapsedMinutes = (totalMinutes: number) => {
  const safe = Math.max(0, totalMinutes);
  return `${Math.floor(safe)}`;
};

interface Props {
  group: KdsOrderGroup;
  isBumped: boolean;
  isRecentlyCompleted?: boolean;
  onBump: (group: KdsOrderGroup) => void;
  onItemReady: (item: KdsOrderGroup["items"][number]) => void;
  disabled?: boolean;
}

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

const KdsOrderColumn = ({
  group,
  isBumped,
  isRecentlyCompleted,
  onBump,
  onItemReady,
  disabled,
}: Props) => {
  const { t } = useTranslation();
  const elapsed = useElapsedMinutes(group.createdAt);
  const timeLabel = formatElapsedMinutes(elapsed);

  const brand =
    group.orderType === "DELIVERY"
      ? getDeliveryPlatformBrand(group.deliveryPlatform ?? "")
      : null;

  const displayOrderNumber =
    group.orderType === "DELIVERY" && group.deliveryOrderNumber
      ? `#${group.deliveryOrderNumber}`
      : `#${group.orderNumber}`;

  const orderMeta = useMemo(() => {
    if (!group.orderType) return null;
    const strategy = getOrderTypeStrategy(group.orderType);
    const typeLabel = t(strategy.labelKey as MessageKey);
    const primaryContext = strategy.secondaryLine({
      orderType: group.orderType,
      tableNumber: group.tableNumber,
      customerName: group.customerName,
      deliveryPlatform: group.deliveryPlatform,
      deliveryOrderNumber: group.deliveryOrderNumber,
    });
    return { typeLabel, primaryContext };
  }, [group, t]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [isLargeOrder, setIsLargeOrder] = useState(false);

  const measureOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isLargeOrder) return;
    if (el.scrollHeight > el.clientHeight + 1) setIsLargeOrder(true);
  }, [isLargeOrder]);

  useLayoutEffect(() => {
    measureOverflow();
  }, [measureOverflow, group.items]);

  useEffect(() => {
    window.addEventListener("resize", measureOverflow);
    return () => window.removeEventListener("resize", measureOverflow);
  }, [measureOverflow]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 2);

    let count = 0;
    const items = el.querySelectorAll<HTMLLIElement>(":scope li");
    const containerBottom = el.getBoundingClientRect().bottom;
    items.forEach((item) => {
      if (item.getBoundingClientRect().bottom > containerBottom + 1) {
        count++;
      }
    });
    setHiddenCount(count);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, group.items.length, isLargeOrder]);

  if (isBumped || isRecentlyCompleted) {
    return (
      <article
        className={cn(
          "flex max-h-full shrink-0 flex-col overflow-hidden rounded-card border border-bumped bg-bumped text-text-inverse shadow-sm",
          isLargeOrder ? "w-[720px]" : "w-[360px]",
        )}
      >
        <div className="flex flex-col gap-2 px-4 pb-4 pt-4">
          <p className="font-mono text-title font-bold italic tracking-tight text-text-inverse/95">
            *** {t("kds.bumped.label")} ***
          </p>
          <p className="font-mono text-subtitle font-semibold tabular-nums text-text-inverse/80">
            {displayOrderNumber}
          </p>
          <p className="font-mono text-heading font-bold tabular-nums text-text-inverse">
            {timeLabel}
          </p>
        </div>
        <div className="flex-1 bg-surface px-4 py-3 opacity-50">
          <ul
            className={cn(
              isLargeOrder
                ? "block max-h-full columns-2 gap-x-2.5 [column-fill:auto]"
                : "flex flex-col gap-1",
            )}
          >
            {group.items.map((item) => (
              <li
                key={item.orderStationItemId}
                className={cn(
                  "min-w-0 break-inside-avoid",
                  isLargeOrder && "mb-2.5",
                )}
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-title font-bold text-text-primary tabular-nums">
                    [{item.quantity}]
                  </span>
                  <span className="text-title font-semibold text-text-primary leading-snug">
                    {item.productName}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </article>
    );
  }

  const OrderTypeIcon = group.orderType
    ? ORDER_TYPE_ICONS[group.orderType]
    : LuUtensilsCrossed;

  return (
    <article
      className={cn(
        "flex max-h-full shrink-0 flex-col overflow-hidden rounded-card border border-border-hover bg-surface shadow-md transition-all duration-normal",
        isLargeOrder ? "w-[720px]" : "w-[360px]",
      )}
    >
      {/* ── Header with order info ── */}
      <div className="flex flex-col gap-1.5 bg-primary px-4 pb-4 pt-4 text-on-primary">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-title font-bold leading-tight tracking-tight">
            {displayOrderNumber}
          </p>
          {orderMeta && group.orderType && (
            <Badge
              size="sm"
              className={cn(
                "gap-1.5 border text-label font-semibold",
                !brand && ORDER_TYPE_BADGE_STYLES[group.orderType],
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
              {group.orderType === "DELIVERY" && group.deliveryPlatform?.trim()
                ? group.deliveryPlatform.trim()
                : orderMeta.typeLabel}
            </Badge>
          )}
        </div>
        {orderMeta?.primaryContext && (
          <p className="text-body-sm font-semibold text-on-primary/88">
            {orderMeta.primaryContext}
          </p>
        )}
        <div className="mt-1 flex items-end gap-2">
          <LuClock3
            size={16}
            className="mb-0.5 shrink-0 text-on-primary/65"
            aria-hidden="true"
          />
          <p className="flex items-end gap-1.5 font-mono text-title font-bold leading-none tabular-nums">
            {timeLabel}
            <span className="pb-px text-body-sm font-semibold text-on-primary/72">
              {t("kds.card.minutesUnit")}
            </span>
          </p>
        </div>
      </div>

      {/* ── Scrollable body with items ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface px-4 py-4",
          !atBottom &&
            "[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]",
        )}
      >
        <ul
          className={cn(
            isLargeOrder
              ? "block max-h-full columns-2 gap-x-2.5 [column-fill:auto]"
              : "flex flex-col gap-1",
          )}
        >
          {group.items.map((item) => (
            <li
              key={item.orderStationItemId}
              className={cn(
                "min-w-0 break-inside-avoid",
                isLargeOrder && "mb-2.5",
              )}
            >
              <button
                type="button"
                onClick={() => onItemReady(item)}
                disabled={disabled}
                aria-pressed={item.status === "READY"}
                aria-label={
                  item.status === "READY"
                    ? t("kds.item.markPending")
                    : t("kds.item.markDone")
                }
                title={
                  item.status === "READY"
                    ? t("kds.item.markPending")
                    : t("kds.item.markDone")
                }
                className={cn(
                  "flex w-full flex-col rounded-segment px-2 py-1.5 text-left transition-all duration-fast",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  item.status === "READY"
                    ? "bg-success-bg/60"
                    : "hover:bg-surface-hover",
                )}
              >
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "shrink-0 font-mono font-bold tabular-nums",
                      "text-title text-text-primary",
                    )}
                  >
                    [{item.quantity}]
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-title font-semibold leading-snug",
                      item.status === "READY"
                        ? "text-text-secondary line-through"
                        : "text-text-primary",
                    )}
                  >
                    {item.productName}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-fast",
                      item.status === "READY"
                        ? "border-success bg-success text-on-status"
                        : "border-border-hover bg-surface-muted text-transparent",
                    )}
                  >
                    <LuCheck size={12} />
                  </span>
                </div>
                {item.note && (
                  <p className="mt-0.5 pl-3 text-caption italic leading-snug text-text-secondary">
                    {item.note}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hiddenCount > 0 && (
        <div className="flex justify-center px-4 pb-1.5">
          <span className="rounded-full bg-surface-hover px-3 py-0.5 text-caption font-semibold text-text-secondary">
            {t("kds.card.moreItems", { count: String(hiddenCount) })}
          </span>
        </div>
      )}

      {/* ── Footer with BUMP button ── */}
      <div className="border-t border-border-hover bg-surface px-4 pb-4 pt-3">
        <Button
          className="w-full text-title"
          onClick={() => onBump(group)}
          disabled={disabled}
        >
          <LuCheck size={18} />
          {t("kds.order.bump")}
        </Button>
      </div>
    </article>
  );
};

export default KdsOrderColumn;
