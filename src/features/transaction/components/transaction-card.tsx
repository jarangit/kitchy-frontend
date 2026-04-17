import { Badge } from "@/shared/components/ui/badge";
import { LuCheck } from "react-icons/lu";

interface OrderProduct {
  name?: string;
  quantity?: number;
  price?: number;
}

interface Props {
  order: {
    id: string;
    orderNumber: string;
    type?: string;
    orderType?: string;
    createdAt: string;
    totalAmount?: number;
    products?: OrderProduct[];
  };
  onClick: () => void;
  isLast?: boolean;
}

const getOrderTypeLabel = (type?: string) => {
  if (!type) return "ออเดอร์";
  if (type === "DINE_IN") return "ทานที่ร้าน";
  if (type === "TOGO") return "กลับบ้าน";
  if (type === "DELIVERY") return "เดลิเวอรี";
  return type;
};

const TransactionCard = ({ order, onClick, isLast = false }: Props) => {
  const date = new Date(order.createdAt);
  const formattedTime = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalAmount =
    order.totalAmount ??
    (order.products?.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
      0
    ) ?? 0);

  const itemCount =
    order.products?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;

  const orderType = order.type ?? order.orderType;
  const orderTypeLabel = getOrderTypeLabel(orderType);

  const productSummary =
    order.products
      ?.slice(0, 2)
      .map((item) => `${item.name ?? "สินค้า"} x${item.quantity ?? 1}`)
      .join("  |  ") ?? `${itemCount} รายการ`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full px-6 py-4 text-left transition-colors duration-[var(--motion-fast)] hover:bg-surface-hover",
        !isLast ? "border-b border-card-border" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-text-inverse">
            <LuCheck size={18} />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-heading font-[var(--weight-semibold)] text-text-primary">
                {order.orderNumber}
              </p>
              <Badge variant="default" className="border border-card-border bg-surface text-text-secondary">
                {orderTypeLabel}
              </Badge>
            </div>
            <p className="line-clamp-1 text-subtitle text-text-secondary">
              {productSummary}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-title font-[var(--weight-semibold)] tabular-nums text-text-primary">
            ฿ {totalAmount.toLocaleString("th-TH", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-subtitle text-text-tertiary">{formattedTime}</p>
        </div>
      </div>
    </button>
  );
};

export default TransactionCard;
