import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onBump: (group: KdsOrderGroup) => void;
  onItemReady: (item: KdsOrderGroup["items"][number]) => void;
  disabled?: boolean;
}

const ORDER_TYPE_BADGE_STYLES: Record<OrderType, string> = {
  DINE_IN: "border-emerald-600 bg-emerald-600 text-white",
  TOGO: "border-amber-500 bg-amber-500 text-white",
  DELIVERY: "border-sky-600 bg-sky-600 text-white",
};

const ORDER_TYPE_ICONS: Record<OrderType, typeof LuUtensilsCrossed> = {
  DINE_IN: LuUtensilsCrossed,
  TOGO: LuPackage,
  DELIVERY: LuBike,
};

const KdsOrderColumn = ({
  group,
  isBumped,
  onBump,
  onItemReady,
  disabled,
}: Props) => {
  const { t } = useTranslation();
  const elapsed = useElapsedMinutes(group.createdAt);
  const timeLabel = formatElapsedMinutes(elapsed);
  const headerOrderLabel =
    group.orderType === "DELIVERY" && group.deliveryOrderNumber
      ? `${group.orderNumber} · ${group.deliveryOrderNumber}`
      : group.orderNumber;

  const orderMeta = useMemo(() => {
    if (!group.orderType) return null;
    const strategy = getOrderTypeStrategy(group.orderType);
    const typeLabel = t(strategy.labelKey as MessageKey);
    const secondary = strategy.secondaryLine({
      orderType: group.orderType,
      tableNumber: group.tableNumber,
      customerName: group.customerName,
      deliveryPlatform: group.deliveryPlatform,
      deliveryOrderNumber: group.deliveryOrderNumber,
    });
    const deliveryCode =
      group.orderType === "DELIVERY" && group.deliveryOrderNumber
        ? t("kds.card.deliveryOrderNumber", {
            orderNumber: group.deliveryOrderNumber,
          })
        : null;
    return { typeLabel, secondary, deliveryCode };
  }, [group, t]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [hiddenCount, setHiddenCount] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 2);

    let count = 0;
    const items = el.querySelectorAll<HTMLLIElement>(":scope > ul > li");
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
  }, [handleScroll, group.items.length]);

  if (isBumped) {
    return (
      <article className="flex max-h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-card border border-bumped bg-bumped text-text-inverse shadow-sm">
        <div className="flex flex-col gap-2 px-4 pb-4 pt-4">
          <p className="font-mono text-title font-bold italic tracking-tight text-text-inverse/95">
            *** {t("kds.bumped.label")} ***
          </p>
          <p className="font-mono text-subtitle font-semibold tabular-nums text-text-inverse/80">
            #{group.orderNumber}
          </p>
          <p className="font-mono text-heading font-bold tabular-nums text-text-inverse">
            {timeLabel}
          </p>
        </div>
        <div className="flex-1 bg-card-bg px-4 py-3 opacity-50">
          <ul className="flex flex-col gap-2">
            {group.items.map((item) => (
              <li key={item.orderStationItemId} className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-body font-bold text-text-primary tabular-nums">
                    [{item.quantity}]
                  </span>
                  <span className="text-body font-semibold text-text-primary">
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
    <article className="flex max-h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-card border border-card-border bg-card-bg shadow-sm transition-all duration-[var(--motion-normal)]">
      {/* ── Header with order info ── */}
      <div className="flex flex-col gap-1.5 bg-primary px-4 pb-4 pt-4 text-on-primary">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-title font-bold leading-tight tracking-tight">
            {headerOrderLabel}
          </p>
          {orderMeta && group.orderType && (
            <Badge
              size="sm"
              className={cn(
                "gap-1.5 border font-semibold",
                ORDER_TYPE_BADGE_STYLES[group.orderType],
              )}
            >
              <OrderTypeIcon size={14} className="shrink-0" />
              {orderMeta.typeLabel}
            </Badge>
          )}
        </div>
        {orderMeta && (orderMeta.secondary || orderMeta.deliveryCode) && (
          <p className="text-caption font-semibold tracking-[0.04em] text-on-primary/85">
            {[orderMeta.secondary, orderMeta.deliveryCode]
              .filter(Boolean)
              .join(" · ")}
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
          "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-card-bg px-4 py-4",
          !atBottom &&
            "[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]",
        )}
      >
        <ul className="flex flex-col gap-3">
          {group.items.map((item) => (
            <li key={item.orderStationItemId} className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "shrink-0 font-mono font-bold tabular-nums",
                    "text-body text-text-primary",
                  )}
                >
                  [{item.quantity}]
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-body font-semibold leading-snug",
                    item.status === "READY"
                      ? "text-text-secondary line-through"
                      : "text-text-primary",
                  )}
                >
                  {item.productName}
                </span>
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
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-[var(--motion-fast)]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    item.status === "READY"
                      ? "border-success bg-success text-white"
                      : "border-border bg-bg text-transparent hover:border-success hover:bg-success-bg hover:text-success",
                  )}
                >
                  <LuCheck size={12} />
                </button>
              </div>
              {item.note && (
                <p className="mt-0.5 pl-6 text-caption italic leading-snug text-text-secondary">
                  {item.note}
                </p>
              )}
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
      <div className="border-t border-border bg-card-bg px-4 pb-4 pt-3">
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
