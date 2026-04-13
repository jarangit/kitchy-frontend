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
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  const itemCount = order.products?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-all text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-800">{order.orderNumber}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}
        >
          {order.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {formattedDate} {formattedTime}
        </span>
        <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
      </div>
    </button>
  );
};

export default TransactionCard;
