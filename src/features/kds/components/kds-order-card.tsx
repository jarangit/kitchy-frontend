import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge, type BadgeVariant } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import type { KdsCard, KdsStatus } from "@/features/kds/types/kds.model";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { getKdsStatusStrategy } from "@/features/kds/strategies/kds-status-strategy";

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
  const { t } = useTranslation();

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
      return { label: t("kds.card.urgency.due"), variant: "danger" };
    }
    if (priorityTone === "next" || waitingMinutes >= 6) {
      return { label: t("kds.card.urgency.soon"), variant: "warning" };
    }
    return { label: t("kds.card.urgency.ok"), variant: "success" };
  }, [waitingMinutes, priorityTone, t]);

  const kdsStatusStrategy = getKdsStatusStrategy(card.status);
  const nextAction = {
    label: t(kdsStatusStrategy.nextActionKey as MessageKey),
    status: kdsStatusStrategy.next,
  };

  const orderInfoParts: string[] = [];
  if (card.orderType) {
    const typeStrategy = getOrderTypeStrategy(card.orderType);
    const typeLabel = t(typeStrategy.labelKey as MessageKey);
    const secondary = typeStrategy.secondaryLine({
      orderType: card.orderType,
      tableNumber: card.tableNumber,
      customerName: card.customerName,
      deliveryPlatform: card.deliveryPlatform,
    });
    orderInfoParts.push(secondary ? `${typeLabel} • ${secondary}` : typeLabel);
  }

  return (
    <div className="flex h-full flex-col rounded-card border border-card-border bg-card-bg p-card-padding">
      {/* ── Product name + quantity (main focus) ── */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {card.productName && (
            <span
              className="block max-w-full truncate text-heading font-semibold leading-tight text-text-primary tracking-tight"
              title={card.productName}
            >
              {card.productName}
            </span>
          )}
          {card.note && (
            <p className="mt-1 text-body-sm leading-5 text-text-tertiary">
              {t("kds.card.note", { note: card.note })}
            </p>
          )}
        </div>
        <span className="shrink-0 text-heading font-semibold text-text-primary tabular-nums">
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
          <p className="font-mono text-subtitle font-semibold text-text-primary tabular-nums">
            {card.orderNumber}
          </p>
        </div>
        {orderInfoParts.length > 0 && (
          <p className="mt-0.5 text-label text-text-secondary">
            {orderInfoParts.join(" ")}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-body font-semibold text-text-primary tabular-nums">
            {timeLabel}
          </p>
          <Badge variant="default" size="md">
            {t("kds.card.waitingMinutes", { minutes: String(waitingMinutes) })}
          </Badge>
          {prioritize && (
            <Badge variant={urgency.variant} size="md">
              {urgency.label}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Action button (sticky bottom) ── */}
      <div className="mt-5 border-t border-border pt-4">
        <Button
          className="h-12 w-full text-body"
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
