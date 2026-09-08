import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuBike,
  LuCheck,
  LuExternalLink,
  LuMousePointerClick,
  LuPackage,
  LuUtensilsCrossed,
} from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import type { ReadyToServeItem } from "@/features/kds/hooks/use-ready-to-serve";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import type { OrderType } from "@/features/pos/types/pos.model";
import { cn } from "@/shared/utils/cn";
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";

const ELAPSED_TICK_MS = 30_000;

const useElapsedMinutes = (iso: string) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ELAPSED_TICK_MS);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, (now - new Date(iso).getTime()) / 60000);
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

interface ReadyOrderGroup {
  orderId: string;
  orderNumber: string;
  orderType?: ReadyToServeItem["orderType"];
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  createdAt: string;
  items: ReadyToServeItem[];
}

interface StationGroup {
  stationId: string;
  stationName: string;
  createdAt: string;
  orders: ReadyOrderGroup[];
}

const groupByStation = (items: ReadyToServeItem[]): StationGroup[] => {
  const stations = new Map<string, ReadyToServeItem[]>();
  for (const item of items) {
    const list = stations.get(item.stationId);
    if (list) {
      list.push(item);
    } else {
      stations.set(item.stationId, [item]);
    }
  }

  const result: StationGroup[] = [];
  for (const [stationId, stationItems] of stations) {
    const orders = new Map<string, ReadyToServeItem[]>();
    for (const item of stationItems) {
      const key = item.orderId || item.id;
      const list = orders.get(key);
      if (list) {
        list.push(item);
      } else {
        orders.set(key, [item]);
      }
    }

    const orderGroups: ReadyOrderGroup[] = [];
    for (const [orderId, orderItems] of orders) {
      const sorted = [...orderItems].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const first = sorted[0];
      if (!first) continue;
      orderGroups.push({
        orderId,
        orderNumber: first.orderNumber,
        orderType: first.orderType,
        tableNumber: first.tableNumber,
        customerName: first.customerName,
        deliveryPlatform: first.deliveryPlatform,
        deliveryOrderNumber: first.deliveryOrderNumber,
        createdAt: first.createdAt,
        items: sorted,
      });
    }
    orderGroups.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const firstItem = [...stationItems].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )[0];
    if (!firstItem) continue;

    result.push({
      stationId,
      stationName: firstItem.stationName,
      createdAt: firstItem.createdAt,
      orders: orderGroups,
    });
  }

  return result.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

interface Props {
  items: ReadyToServeItem[];
  servingIds: Set<string>;
  onServed: (item: ReadyToServeItem) => void;
  storeId?: string;
}

/** How long a fully-served order stays visible as a completion notice before leaving the board. */
const COMPLETED_VISIBLE_MS = 2500;

interface CompletedSnapshot {
  stationId: string;
  stationName: string;
  group: ReadyOrderGroup;
}

function ReadyOrderCard({
  group,
  servingIds,
  onServed,
  onServeAll,
}: {
  group: ReadyOrderGroup;
  servingIds: Set<string>;
  onServed: (item: ReadyToServeItem) => void;
  onServeAll: () => void;
}) {
  const { t } = useTranslation();
  const elapsed = useElapsedMinutes(group.createdAt);
  const isOverdue = elapsed >= 15;

  const orderType = group.orderType as OrderType | undefined;
  const strategy = orderType ? getOrderTypeStrategy(orderType) : null;
  const typeLabel = strategy
    ? orderType === "DELIVERY" && group.deliveryPlatform?.trim()
      ? group.deliveryPlatform.trim()
      : t(strategy.labelKey as MessageKey)
    : null;
  const primaryContext = strategy
    ? strategy.secondaryLine({
        orderType,
        tableNumber: group.tableNumber,
        customerName: group.customerName,
        deliveryPlatform: group.deliveryPlatform,
        deliveryOrderNumber: group.deliveryOrderNumber,
      })
    : null;
  const OrderTypeIcon = orderType
    ? ORDER_TYPE_ICONS[orderType]
    : LuUtensilsCrossed;
  const brand =
    orderType === "DELIVERY"
      ? getDeliveryPlatformBrand(group.deliveryPlatform ?? "")
      : null;

  const displayOrderNumber =
    orderType === "DELIVERY" && group.deliveryOrderNumber
      ? `#${group.deliveryOrderNumber}`
      : `#${group.orderNumber}`;

  const readyItems = group.items.filter((item) => item.status === "READY");
  const allServing =
    readyItems.length > 0 &&
    readyItems.every((item) => servingIds.has(item.id));

  return (
    <article className="flex max-h-full min-h-0 w-[360px] shrink-0 self-stretch flex-col overflow-hidden rounded-card border border-success bg-surface shadow-md transition-all duration-normal">
      <div className="flex flex-col gap-1.5 border-b border-success bg-success-bg px-4 pb-4 pt-4 text-success">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-title font-bold leading-tight tracking-tight">
            {displayOrderNumber}
          </p>
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
              <OrderTypeIcon size={14} className="shrink-0" />
              {typeLabel}
            </Badge>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
        {primaryContext && (
          <p className="text-body-sm font-semibold text-success/88">
            {primaryContext}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant={isOverdue ? "danger" : "warning"}
            size="sm"
            className={cn(
              "shrink-0",
              isOverdue && "border-danger bg-danger text-on-status shadow-sm",
            )}
          >
            {t("serve.item.waiting", {
              minutes: String(Math.floor(Math.max(0, elapsed))),
            })}
          </Badge>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface px-4 py-4">
        {readyItems.length > 0 && (
          <p className="flex shrink-0 items-center gap-1.5 text-caption font-medium text-text-secondary">
            <LuMousePointerClick size={14} aria-hidden="true" />
            {t("serve.hint.tapItem")}
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {group.items.map((item) => {
            const isServing = servingIds.has(item.id);
            const isReady = item.status === "READY";
            const isServed = item.status === "SERVED";
            const rowBody = (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="shrink-0 font-mono text-title font-bold text-text-primary tabular-nums">
                    [{item.quantity}]
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-title font-semibold leading-snug",
                      isServed
                        ? "text-text-secondary line-through"
                        : "text-text-primary",
                    )}
                  >
                    {item.productName}
                  </span>
                  <Badge
                    size="sm"
                    variant={
                      item.status === "PENDING"
                        ? "warning"
                        : item.status === "READY"
                          ? "success"
                          : "default"
                    }
                    className="shrink-0"
                  >
                    {t(`kds.status.${item.status.toLowerCase()}` as MessageKey)}
                  </Badge>
                </div>
                {item.note && (
                  <p className="mt-0.5 pl-3 text-caption italic leading-snug text-text-secondary">
                    {item.note}
                  </p>
                )}
                {isServing && (
                  <p className="mt-0.5 pl-3 text-caption font-semibold leading-snug text-text-secondary">
                    {t("serve.action.serving")}
                  </p>
                )}
              </>
            );

            return (
              <li key={item.id} className="min-w-0 break-inside-avoid">
                {isReady ? (
                  <button
                    type="button"
                    onClick={() => onServed(item)}
                    disabled={isServing}
                    aria-label={`${t("serve.action.served")} · ${item.productName} x${item.quantity}`}
                    title={`${t("serve.action.served")} · ${item.productName} x${item.quantity}`}
                    className="flex w-full flex-col rounded-segment bg-success-bg/60 px-2 py-1.5 text-left transition-all duration-fast hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {rowBody}
                  </button>
                ) : (
                  <div
                    aria-label={`${t(`kds.status.${item.status.toLowerCase()}` as MessageKey)} · ${item.productName} x${item.quantity}`}
                    title={
                      item.status === "PENDING"
                        ? t("kds.status.pending")
                        : t("kds.status.served")
                    }
                    className={cn(
                      "flex w-full flex-col rounded-segment px-2 py-1.5",
                      isServed
                        ? "bg-surface-muted opacity-60"
                        : "bg-surface-muted",
                    )}
                  >
                    {rowBody}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {readyItems.length > 0 && (
        <div className="border-t border-border-hover bg-surface px-4 pb-4 pt-3">
          <Button
            className="w-full text-title"
            onClick={onServeAll}
            disabled={allServing}
          >
            <LuCheck size={18} />
            {allServing
              ? t("serve.action.serving")
              : readyItems.length > 1
                ? `${t("serve.action.served")} (${readyItems.length})`
                : t("serve.action.served")}
          </Button>
        </div>
      )}
    </article>
  );
}

function CompletedOrderCard({
  group,
  storeId,
}: {
  group: ReadyOrderGroup;
  storeId?: string;
}) {
  const { t } = useTranslation();

  return (
    <article className="flex max-h-full min-h-0 w-[360px] shrink-0 self-stretch flex-col items-center justify-center gap-2 overflow-hidden rounded-card border border-success bg-success-bg px-4 py-8 text-center text-success shadow-md">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-on-status">
        <LuCheck size={24} aria-hidden="true" />
      </span>
      <p className="font-mono text-title font-bold tracking-tight">
        #{group.orderNumber}
      </p>
      <p className="text-subtitle font-bold">{t("serve.complete.title")}</p>
      <p className="text-body-sm font-medium text-text-secondary">
        {t("serve.complete.historyHint")}
      </p>
      {storeId && (
        <Link
          to={`/store/${storeId}/transactions`}
          className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-button px-3 text-button-sm font-button text-success underline underline-offset-4 transition-opacity duration-fast hover:opacity-80"
        >
          <LuExternalLink size={15} aria-hidden="true" />
          {t("serve.complete.openHistory")}
        </Link>
      )}
    </article>
  );
}

export function ReadyToServeGrid({
  items,
  servingIds,
  onServed,
  storeId,
}: Props) {
  const { t } = useTranslation();
  const stationGroups = useMemo(() => groupByStation(items), [items]);
  const [completed, setCompleted] = useState<CompletedSnapshot[]>([]);
  const timeouts = useRef(new Map<string, number>());

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      for (const id of pending.values()) window.clearTimeout(id);
      pending.clear();
    };
  }, []);

  const flagCompleted = (station: StationGroup, group: ReadyOrderGroup) => {
    if (timeouts.current.has(group.orderId)) return;
    setCompleted((prev) => {
      if (prev.some((entry) => entry.group.orderId === group.orderId)) {
        return prev;
      }
      return [
        ...prev,
        {
          stationId: station.stationId,
          stationName: station.stationName,
          group,
        },
      ];
    });
    const timeoutId = window.setTimeout(() => {
      timeouts.current.delete(group.orderId);
      setCompleted((prev) =>
        prev.filter((entry) => entry.group.orderId !== group.orderId),
      );
    }, COMPLETED_VISIBLE_MS);
    timeouts.current.set(group.orderId, timeoutId);
  };

  const handleItemServed = (
    station: StationGroup,
    group: ReadyOrderGroup,
    item: ReadyToServeItem,
  ) => {
    const isLastUnserved =
      item.status === "READY" &&
      group.items.every(
        (entry) => entry.id === item.id || entry.status === "SERVED",
      );
    onServed(item);
    if (isLastUnserved) flagCompleted(station, group);
  };

  const handleServeAll = (station: StationGroup, group: ReadyOrderGroup) => {
    const willComplete = group.items.every(
      (entry) => entry.status !== "PENDING",
    );
    for (const entry of group.items) {
      if (entry.status === "READY" && !servingIds.has(entry.id)) {
        onServed(entry);
      }
    }
    if (willComplete) flagCompleted(station, group);
  };

  const completedOrderIds = useMemo(
    () => new Set(completed.map((entry) => entry.group.orderId)),
    [completed],
  );

  const visibleStations = useMemo(
    () =>
      stationGroups
        .map((station) => ({
          ...station,
          orders: station.orders.filter(
            (group) =>
              !completedOrderIds.has(group.orderId) &&
              !group.items.every((item) => item.status === "SERVED"),
          ),
          completed: completed.filter(
            (entry) => entry.stationId === station.stationId,
          ),
        }))
        .filter(
          (station) =>
            station.orders.length > 0 || station.completed.length > 0,
        ),
    [stationGroups, completed, completedOrderIds],
  );

  if (visibleStations.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-title text-text-primary">{t("serve.empty.title")}</p>
        <p className="mt-1 text-body-sm text-text-secondary">
          {t("serve.empty.body")}
        </p>
        {storeId && (
          <Link
            to={`/store/${storeId}/transactions`}
            className="mx-auto mt-3 inline-flex min-h-9 w-fit items-center gap-1.5 rounded-button px-3 text-button-sm font-button text-text-primary transition-colors duration-fast hover:bg-button-ghost-bg-hover"
          >
            <LuExternalLink size={15} aria-hidden="true" />
            {t("serve.complete.openHistory")}
          </Link>
        )}
      </Card>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
      {visibleStations.map((station) => (
        <section
          key={station.stationId}
          aria-label={station.stationName}
          className="flex min-h-0 shrink-0 flex-col"
        >
          <div className="flex h-[calc(100dvh-300px)] min-h-[420px] gap-4 overflow-x-auto pb-2">
            {station.orders.map((group) => (
              <ReadyOrderCard
                key={group.orderId}
                group={group}
                servingIds={servingIds}
                onServed={(item) => handleItemServed(station, group, item)}
                onServeAll={() => handleServeAll(station, group)}
              />
            ))}
            {station.completed.map((entry) => (
              <CompletedOrderCard
                key={`completed-${entry.group.orderId}`}
                group={entry.group}
                storeId={storeId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
