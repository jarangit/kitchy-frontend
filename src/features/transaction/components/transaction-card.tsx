import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  toStatusBadgeVariant,
  toStatusBorderClass,
  formatStatusLabel,
} from "@/shared/utils/status";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { LuChevronDown, LuChevronUp, LuExternalLink } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

interface OrderItem {
  id?: string;
  productId?: string;
  name?: string;
  quantity?: number;
  price?: number;
  note?: string;
  product?: { name?: string; price?: number };
}

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
  const [expanded, setExpanded] = useState(false);

  // Lazy-fetch order detail only when expanded
  const { data: orderDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["transaction-detail", order.id],
    queryFn: () => transactionServiceApi.getById(order.id),
    enabled: expanded,
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000, // cache 5 min
  });

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

  const itemCount = order.products?.length ?? 0;

  const totalAmount =
    order.totalAmount ??
    order.products?.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
      0
    );

  const items: OrderItem[] = orderDetail?.products ?? orderDetail?.items ?? [];

  const getItemName = (item: OrderItem) =>
    item.name || item.product?.name || `Product #${item.productId ?? "?"}`;

  const getItemPrice = (item: OrderItem) =>
    item.price ?? item.product?.price ?? 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={cn("w-full bg-[var(--color-bg)] rounded-radius-md border border-[var(--color-border)] border-l-4", toStatusBorderClass(order.status), "hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] text-left overflow-hidden")}
    >
      {/* Header row — clickable to expand */}
      <button
        onClick={handleToggle}
        className="w-full p-4 active:scale-[0.99] transition-transform duration-[var(--motion-fast)] text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={toStatusBadgeVariant(order.status)}>
              {formatStatusLabel(order.status)}
            </Badge>
            {expanded ? (
              <LuChevronUp size={18} className="text-[var(--color-text-tertiary)]" />
            ) : (
              <LuChevronDown size={18} className="text-[var(--color-text-tertiary)]" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-label text-[var(--color-text-secondary)]">
          <span>
            {formattedDate} {formattedTime}
          </span>
          <div className="flex items-center gap-3">
            <span>
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
            {totalAmount != null && totalAmount > 0 && (
              <span className="font-[var(--weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                ฿{totalAmount.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded items section */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)]">
          {isLoadingDetail ? (
            <div className="pt-3 space-y-2">
              <Skeleton height="h-4" width="w-3/4" />
              <Skeleton height="h-4" width="w-1/2" />
              <Skeleton height="h-4" width="w-2/3" />
            </div>
          ) : items.length > 0 ? (
            <div className="pt-3 space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id || item.productId || index}
                  className="flex justify-between gap-3 text-body-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[var(--color-text-secondary)]">
                      <span className="tabular-nums">{item.quantity ?? 1}x</span>{" "}
                      <span className="line-clamp-1">{getItemName(item)}</span>
                    </span>
                    {item.note && (
                      <p className="text-caption text-[var(--color-text-tertiary)] mt-0.5 line-clamp-1">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <span className="font-[var(--weight-medium)] tabular-nums text-[var(--color-text-primary)] shrink-0">
                    ฿{(getItemPrice(item) * (item.quantity ?? 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="pt-3 text-body-sm text-[var(--color-text-tertiary)]">
              No items found
            </p>
          )}

          {/* View detail link */}
          <button
            onClick={onClick}
            className="mt-3 flex items-center gap-1.5 text-label text-[var(--color-primary)] hover:underline active:scale-[0.98] transition-transform"
          >
            <LuExternalLink size={14} />
            View full detail
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
