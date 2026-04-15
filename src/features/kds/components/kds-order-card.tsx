import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import type { KdsCard, KdsStatus } from "@/features/kds/types/kds.model";

interface Props {
  card: KdsCard;
  onMove: (card: KdsCard, status: KdsStatus) => void;
  disabled?: boolean;
  queueNumber?: number;
  prioritize?: boolean;
  priorityTone?: "due" | "next" | "normal";
}

const KdsOrderCard = ({
  card,
  onMove,
  disabled,
  queueNumber,
  prioritize = false,
  priorityTone = "normal",
}: Props) => {
  const timeLabel = useMemo(() => {
    const createdAt = new Date(card.createdAt);
    return createdAt.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [card.createdAt]);

  const waitingMinutes = useMemo(() => {
    const diffMs = Date.now() - new Date(card.createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  }, [card.createdAt]);

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
  }, [waitingMinutes, priorityTone]);

  const nextAction =
    card.status === "READY"
      ? { label: "Back to Pending", status: "PENDING" as const }
      : { label: "Mark Ready", status: "READY" as const };

  const orderInfoParts: string[] = [];
  if (card.orderType) {
    let part = card.orderType.replace("_", " ");
    if (card.orderType === "DINE_IN" && card.tableNumber) {
      part += ` • ${card.tableNumber}`;
    }
    if (card.orderType === "DELIVERY" && card.customerName) {
      part += ` • ${card.customerName}`;
    }
    if (card.orderType === "DELIVERY" && card.deliveryPlatform) {
      part += ` (${card.deliveryPlatform})`;
    }
    orderInfoParts.push(part);
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      {/* ── Product name + quantity (main focus) ── */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {card.productName && (
            <span
              className="block max-w-full truncate text-2xl font-bold leading-tight text-[var(--color-text-primary)]"
              title={card.productName}
            >
              {card.productName}
            </span>
          )}
          {card.note && (
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-tertiary)]">
              Note: {card.note}
            </p>
          )}
        </div>
        <span className="shrink-0 text-2xl font-bold text-[var(--color-text-primary)]">
          x{card.quantity}
        </span>
      </div>

      {/* ── Order info (secondary) ── */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {prioritize && queueNumber != null && (
            <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--color-info-bg)] px-2.5 text-sm font-semibold text-[var(--color-info)]">
              #{queueNumber}
            </span>
          )}
          <p className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
            {card.orderNumber}
          </p>
        </div>
        {orderInfoParts.length > 0 && (
          <p className="mt-0.5 text-sm font-medium text-[var(--color-text-secondary)]">
            {orderInfoParts.join(" ")}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold text-[var(--color-text-primary)]">
            {timeLabel}
          </p>
          <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--color-surface-hover)] px-2.5 text-sm font-semibold text-[var(--color-text-primary)]">
            {waitingMinutes}m
          </span>
          {prioritize && (
            <span
              className={`inline-flex min-h-7 items-center rounded-full px-2.5 text-sm font-semibold ${urgency.className}`}
            >
              {urgency.label}
            </span>
          )}
        </div>
      </div>

      {/* ── Action button (sticky bottom) ── */}
      <div className="mt-4 border-t border-[var(--color-border)] pt-3">
        <Button
          className="h-12 w-full text-base font-semibold"
          onClick={() => onMove(card, nextAction.status)}
          disabled={disabled}
        >
          {nextAction.label}
        </Button>
      </div>
    </div>
  );
};

export default KdsOrderCard;
