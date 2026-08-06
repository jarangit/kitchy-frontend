import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuUtensilsCrossed } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { cn } from "@/shared/utils/cn";

const ELAPSED_TICK_MS = 30_000;

const useElapsedMinutes = (iso: string) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ELAPSED_TICK_MS);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, (now - new Date(iso).getTime()) / 60000);
};

const formatMmSs = (totalMinutes: number) => {
  const safe = Math.max(0, totalMinutes);
  const minutes = Math.floor(safe);
  const seconds = Math.floor((safe - minutes) * 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

interface Props {
  group: KdsOrderGroup;
  isBumped: boolean;
  onBump: (group: KdsOrderGroup) => void;
  disabled?: boolean;
}

const KdsOrderColumn = ({ group, isBumped, onBump, disabled }: Props) => {
  const { t } = useTranslation();
  const elapsed = useElapsedMinutes(group.createdAt);
  const timeLabel = formatMmSs(elapsed);

  const sourceLabel = useMemo(() => {
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
    return secondary ? `${typeLabel} · ${secondary}` : typeLabel;
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

  return (
    <article className="flex max-h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-card border border-card-border bg-card-bg shadow-sm transition-all duration-[var(--motion-normal)]">
      {/* ── Header with order info ── */}
      <div className="flex flex-col gap-1.5 bg-primary px-4 pb-4 pt-4 text-text-inverse">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-title font-bold leading-tight tracking-tight">
            {group.orderNumber}
          </p>
          <LuUtensilsCrossed size={18} className="shrink-0 text-text-inverse/90" />
        </div>
        {sourceLabel && (
          <p className="text-caption font-semibold uppercase tracking-[0.04em] text-text-inverse/90">
            {sourceLabel}
          </p>
        )}
        {group.orderType === "DELIVERY" && group.deliveryOrderNumber && (
          <p className="font-mono text-caption font-semibold tabular-nums text-text-inverse/85">
            {t("kds.card.deliveryOrderNumber", {
              orderNumber: group.deliveryOrderNumber,
            })}
          </p>
        )}
        <p className="mt-1 font-mono text-heading font-bold leading-none tabular-nums">
          {timeLabel}
        </p>
      </div>

      {/* ── Scrollable body with items ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-card-bg px-4 py-4",
          !atBottom && "[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
        )}
      >
        <ul className="flex flex-col gap-3">
          {group.items.map((item) => (
            <li key={item.orderStationItemId} className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "shrink-0 font-mono font-bold tabular-nums",
                    "text-body text-text-primary"
                  )}
                >
                  [{item.quantity}]
                </span>
                <span className="min-w-0 text-body font-semibold leading-snug text-text-primary">
                  {item.productName}
                </span>
              </div>
              {item.note && (
                <p className="mt-0.5 pl-6 text-caption italic leading-snug text-accent">
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
