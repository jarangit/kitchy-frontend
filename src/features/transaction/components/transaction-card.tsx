interface Props {
  order: {
    id: number;
    orderNumber: string;
    status: string;
    createdAt: string;
    products?: { name?: string; quantity?: number }[];
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

  const statusColor =
    order.status === "COMPLETED"
      ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
      : "bg-[var(--color-warning-bg)] text-[var(--color-warning)]";

  const itemCount = order.products?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="w-full bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[var(--color-text-primary)]">{order.orderNumber}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}
        >
          {order.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
        <span>
          {formattedDate} {formattedTime}
        </span>
        <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
      </div>
    </button>
  );
};

export default TransactionCard;
