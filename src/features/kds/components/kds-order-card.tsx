import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge, type BadgeVariant } from "@/shared/components/ui/badge";
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

  const urgency = useMemo<{ label: string; variant: BadgeVariant }>(() => {
    if (priorityTone === "due" || waitingMinutes >= 10) {
      return { label: "DUE NOW", variant: "danger" };
    }
    if (priorityTone === "next" || waitingMinutes >= 6) {
      return { label: "SOON", variant: "warning" };
    }
    return { label: "OK", variant: "success" };
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
    <div className="flex h-full flex-col rounded-radius-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {/* ── Product name + quantity (main focus) ── */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {card.productName && (
            <span
              className="block max-w-full truncate text-heading font-[var(--weight-bold)] leading-tight text-[var(--color-text-primary)]"
              title={card.productName}
            >
              {card.productName}
            </span>
          )}
          {card.note && (
            <p className="mt-1 text-body-sm leading-5 text-[var(--color-text-tertiary)]">
              Note: {card.note}
            </p>
          )}
        </div>
        <span className="shrink-0 text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
          x{card.quantity}
        </span>
      </div>

      {/* ── Order info (secondary) ── */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {prioritize && queueNumber != null && (
            <Badge variant="info" size="md">
              #{queueNumber}
            </Badge>
          )}
          <p className="font-mono text-subtitle font-[var(--weight-bold)] text-[var(--color-text-primary)]">
            {card.orderNumber}
          </p>
        </div>
        {orderInfoParts.length > 0 && (
          <p className="mt-0.5 text-label text-[var(--color-text-secondary)]">
            {orderInfoParts.join(" ")}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-body font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
            {timeLabel}
          </p>
          <Badge variant="default" size="md" className="font-[var(--weight-semibold)]">
            {waitingMinutes}m
          </Badge>
          {prioritize && (
            <Badge variant={urgency.variant} size="md" className="font-[var(--weight-semibold)]">
              {urgency.label}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Action button (sticky bottom) ── */}
      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
          <Button
          className="h-12 w-full text-body font-[var(--weight-semibold)]"
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
