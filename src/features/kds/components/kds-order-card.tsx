import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { KdsOrder, KdsStatus } from "@/features/kds/types/kds.model";

interface Props {
  order: KdsOrder;
  onMove: (orderId: number, status: KdsStatus) => void;
  disabled?: boolean;
}

const KdsOrderCard = ({ order, onMove, disabled }: Props) => {
  const timeLabel = useMemo(() => {
    const createdAt = new Date(order.createdAt);
    return createdAt.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [order.createdAt]);

  const nextAction =
    order.status === "PENDING"
      ? { label: "Start Cooking", status: "COOKING" as const }
      : order.status === "COOKING"
        ? { label: "Mark Ready", status: "READY" as const }
        : { label: "Back to Cooking", status: "COOKING" as const };

  const badgeVariant =
    order.status === "READY"
      ? "success"
      : order.status === "COOKING"
        ? "info"
        : "warning";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono font-semibold text-[var(--color-text-primary)]">
            {order.orderNumber}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {timeLabel}
          </p>
        </div>
        <Badge variant={badgeVariant}>{order.status}</Badge>
      </div>

      <div className="space-y-1.5">
        {order.items.length === 0 ? (
          <p className="text-sm text-[var(--color-text-tertiary)]">No items</p>
        ) : (
          order.items.map((item) => (
            <div
              key={`${order.id}-${item.id}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[var(--color-text-primary)]">{item.name}</span>
              <span className="font-semibold text-[var(--color-text-secondary)]">
                x{item.quantity}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]">
        <Button
          className="w-full h-11"
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
