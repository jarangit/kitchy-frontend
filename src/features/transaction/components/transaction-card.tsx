import { Badge } from "@/shared/components/ui/badge";

interface Props {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    totalAmount?: number;
    products?: { name?: string; quantity?: number; price?: number }[];
  };
  onClick: () => void;
}

const TransactionCard = ({ order, onClick }: Props) => {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getBadgeVariant = () => {
    switch (order.status) {
      case "COMPLETED":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      case "CANCELLED":
        return "danger" as const;
      default:
        return "default" as const;
    }
  };

  const getBorderColor = () => {
    switch (order.status) {
      case "COMPLETED":
        return "border-l-[var(--color-success)]";
      case "PENDING":
        return "border-l-[var(--color-warning)]";
      case "CANCELLED":
        return "border-l-[var(--color-danger)]";
      default:
        return "border-l-[var(--color-border)]";
    }
  };

  const itemCount = order.products?.length ?? 0;

  const totalAmount =
    order.totalAmount ??
    order.products?.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
      0
    );

  return (
    <button
      onClick={onClick}
      className={`w-full bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] border-l-4 ${getBorderColor()} p-4 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] text-left`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[var(--color-text-primary)]">{order.orderNumber}</span>
        <Badge variant={getBadgeVariant()}>
          {order.status}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
        <span>
          {formattedDate} {formattedTime}
        </span>
        <div className="flex items-center gap-3">
          <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
          {totalAmount != null && totalAmount > 0 && (
            <span className="font-medium text-[var(--color-text-primary)]">
              ฿{totalAmount.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default TransactionCard;
