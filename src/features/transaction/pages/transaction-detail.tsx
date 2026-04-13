import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { Button } from "@/shared/components/ui/button";
import { LuArrowLeft } from "react-icons/lu";

const TransactionDetailPage = () => {
  const { id: storeId, txId } = useParams<{ id: string; txId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["transaction", txId],
    queryFn: () => transactionServiceApi.getById(Number(txId)),
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
  const statusColor =
    order.status === "COMPLETED"
      ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
      : "bg-[var(--color-warning-bg)] text-[var(--color-warning)]";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/store/${storeId}/transactions`)}
        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
      >
        <LuArrowLeft size={16} />
        Back to History
      </button>

      <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Order {order.orderNumber}
          </h1>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
          >
            {order.status}
          </span>
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
          <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
            <h3 className="font-semibold text-[var(--color-text-primary)]">Items</h3>
            {order.products.map(
              (
                item: {
                  id?: number;
                  productId?: number;
                  name?: string;
                  quantity?: number;
                  price?: number;
                },
                index: number
              ) => (
                <div
                  key={item.id || item.productId || index}
                  className="flex justify-between text-sm text-[var(--color-text-secondary)]"
                >
                  <span>
                    {item.name || `Product #${item.productId}`} x
                    {item.quantity || 1}
                  </span>
                  {item.price && (
                    <span>
                      ฿
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  )}
                </div>
              )
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
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
