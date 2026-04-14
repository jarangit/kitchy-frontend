import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { KdsOrder, KdsStatus } from "@/features/kds/types/kds.model";
import { toStatusBadgeVariant } from "@/shared/utils/status";

interface Props {
  order: KdsOrder;
  onMove: (orderId: string, status: KdsStatus) => void;
  disabled?: boolean;
  queueNumber?: number;
  prioritize?: boolean;
  priorityTone?: "due" | "next" | "normal";
  showStatusBadge?: boolean;
}

const KdsOrderCard = ({
  order,
  onMove,
  disabled,
  queueNumber,
  prioritize = false,
  priorityTone = "normal",
  showStatusBadge = true,
}: Props) => {
  const timeLabel = useMemo(() => {
    const createdAt = new Date(order.createdAt);
    return createdAt.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [order.createdAt]);

  const waitingMinutes = useMemo(() => {
    const createdAtMs = new Date(order.createdAt).getTime();
    const diffMs = Date.now() - createdAtMs;
    return Math.max(0, Math.floor(diffMs / 60000));
  }, [order.createdAt]);

  const urgency = useMemo(() => {
    if (priorityTone === "due" || waitingMinutes >= 10) {
      return {
        label: "DUE NOW",
        className: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
      };
    }
    if (priorityTone === "next" || waitingMinutes >= 6) {
      return {
        label: "SOON",
        className: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
      };
    }
    return {
      label: "OK",
      className: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
    };
  }, [waitingMinutes]);

  const nextAction =
    order.status === "READY"
      ? { label: "Back to Pending", status: "PENDING" as const }
      : { label: "Mark Ready", status: "READY" as const };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {prioritize && queueNumber != null && (
            <div className="mb-2 inline-flex min-h-7 items-center rounded-full bg-[var(--color-info-bg)] px-2.5 text-sm font-semibold text-[var(--color-info)]">
              #{queueNumber} Next
            </div>
          )}
          <p className="font-mono text-xl font-bold text-[var(--color-text-primary)]">
            {order.orderNumber}
          </p>
          {order.orderType && (
            <p className="mt-0.5 text-sm font-medium text-[var(--color-text-secondary)]">
              {order.orderType}
              {order.orderType === "DINE_IN" && order.tableNumber
                ? ` • ${order.tableNumber}`
                : ""}
              {order.orderType === "DELIVERY" && order.customerName
                ? ` • ${order.customerName}`
                : ""}
              {order.orderType === "DELIVERY" && order.deliveryPlatform
                ? ` (${order.deliveryPlatform})`
                : ""}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              {timeLabel}
            </p>
            <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--color-surface-hover)] px-2.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Waiting {waitingMinutes}m
            </span>
            {prioritize && (
              <span className={`inline-flex min-h-7 items-center rounded-full px-2.5 text-sm font-semibold ${urgency.className}`}>
                {urgency.label}
              </span>
            )}
          </div>
        </div>
        {showStatusBadge && (
          <Badge variant={toStatusBadgeVariant(order.status)}>{order.status}</Badge>
        )}
      </div>

      <div className="flex-1 space-y-2">
        {order.items.length === 0 ? (
          <p className="text-base text-[var(--color-text-tertiary)]">No items</p>
        ) : (
          order.items.map((item) => (
            <div
              key={`${order.id}-${item.id}`}
              className="flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <span
                  className="block max-w-full truncate text-lg font-semibold leading-tight text-[var(--color-text-primary)]"
                  title={item.name}
                >
                  {item.name}
                </span>
                {item.note && (
                  <p className="mt-1 text-sm leading-5 text-[var(--color-text-tertiary)]">
                    Note: {item.note}
                  </p>
                )}
              </div>
              <span className="text-lg font-bold text-[var(--color-text-primary)]">
                x{item.quantity}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 border-t border-[var(--color-border)] pt-3">
        <Button
          className="h-12 w-full text-base font-semibold"
          onClick={() => onMove(order.id, nextAction.status)}
          disabled={disabled}
        >
          {nextAction.label}
        </Button>
      </div>
    </div>
  );
};

export default KdsOrderCard;
