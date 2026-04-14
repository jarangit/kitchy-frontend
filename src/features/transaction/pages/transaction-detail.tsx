import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LuArrowLeft } from "react-icons/lu";

const TransactionDetailPage = () => {
  const { id: storeId, txId } = useParams<{ id: string; txId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["transaction", txId],
    queryFn: () => transactionServiceApi.getById(txId as string),
    enabled: !!txId,
    select: (res) => res.data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)] mb-4">Transaction not found</p>
        <Button onClick={() => navigate(`/store/${storeId}/transactions`)}>
          Back to History
        </Button>
      </div>
    );
  }

  const date = new Date(order.createdAt);

  const getBadgeVariant = (status: string) => {
    switch (status) {
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

  const grandTotal =
    order.products?.reduce(
      (sum: number, item: { price?: number; quantity?: number }) =>
        sum + (item.price || 0) * (item.quantity || 1),
      0
    ) ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/store/${storeId}/transactions`)}
      >
        <LuArrowLeft size={16} />
        Back to History
      </Button>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        {/* Order Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {order.orderNumber}
          </h1>
          <Badge variant={getBadgeVariant(order.status)}>
            {order.status}
          </Badge>
        </div>

        <div className="text-sm text-[var(--color-text-secondary)] mb-6">
          {date.toLocaleDateString("th-TH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          {date.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Order Items */}
        {order.products && order.products.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Items</h3>
            <div className="space-y-3">
              {order.products.map(
                (
                  item: {
                    id?: string;
                    productId?: string;
                    name?: string;
                    quantity?: number;
                    price?: number;
                    note?: string;
                  },
                  index: number
                ) => (
                  <div
                    key={item.id || item.productId || index}
                    className="flex justify-between gap-3 text-sm text-[var(--color-text-secondary)]"
                  >
                    <div>
                      <span>
                        {item.name || `Product #${item.productId}`} x
                        {item.quantity || 1}
                      </span>
                      {item.note && (
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-tertiary)]">
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                    {item.price != null && (
                      <span className="font-medium text-[var(--color-text-primary)]">
                        ฿{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Grand Total */}
            {grandTotal > 0 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--color-border)]">
                <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                <span className="text-xl font-bold text-[var(--color-text-primary)]">
                  ฿{grandTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Order Info */}
        <div className="border-t border-[var(--color-border)] pt-4 mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-medium text-[var(--color-text-primary)]">#{order.id}</span>
          </div>
          {order.type && (
            <div className="flex justify-between">
              <span>Type</span>
              <span className="font-medium text-[var(--color-text-primary)]">{order.type}</span>
            </div>
          )}
          {order.tableNumber && (
            <div className="flex justify-between">
              <span>Table</span>
              <span className="font-medium text-[var(--color-text-primary)]">{order.tableNumber}</span>
            </div>
          )}
          {order.customerName && (
            <div className="flex justify-between">
              <span>Customer</span>
              <span className="font-medium text-[var(--color-text-primary)]">{order.customerName}</span>
            </div>
          )}
          {order.deliveryPlatform && (
            <div className="flex justify-between">
              <span>Platform</span>
              <span className="font-medium text-[var(--color-text-primary)]">{order.deliveryPlatform}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
