import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  toStatusBadgeVariant,
  formatStatusLabel,
  formatOrderTypeLabel,
} from "@/shared/utils/status";
import { LuArrowLeft, LuReceipt } from "react-icons/lu";

/* ── Types for API response items ──────────────────── */

interface OrderItem {
  id?: string;
  productId?: string;
  name?: string;
  quantity?: number;
  price?: number;
  note?: string;
  product?: { name?: string; price?: number };
}

/* ── Helpers ───────────────────────────────────────── */

const getItemName = (item: OrderItem) =>
  item.name || item.product?.name || `Product #${item.productId ?? "?"}`;

const getItemPrice = (item: OrderItem) =>
  item.price ?? item.product?.price ?? 0;

const formatCurrency = (amount: number) => `฿${amount.toFixed(2)}`;

/* ── Section wrapper ───────────────────────────────── */

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--color-border)] pt-5">
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

/* ── Info row ──────────────────────────────────────── */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-sm text-[var(--color-text-secondary)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--color-text-primary)] text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}

/* ── Loading skeleton ──────────────────────────────── */

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton height="h-9" width="w-32" />
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] p-[var(--card-padding)] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton height="h-7" width="w-36" />
          <Skeleton height="h-6" width="w-20" />
        </div>
        <Skeleton height="h-4" width="w-48" />
        {/* Order info */}
        <div className="border-t border-[var(--color-border)] pt-5 space-y-2">
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-4" width="w-1/2" />
        </div>
        {/* Items */}
        <div className="border-t border-[var(--color-border)] pt-5 space-y-3">
          <Skeleton height="h-3" width="w-16" />
          <Skeleton height="h-5" width="w-full" />
          <Skeleton height="h-5" width="w-full" />
          <Skeleton height="h-5" width="w-3/4" />
        </div>
        {/* Total */}
        <div className="border-t border-[var(--color-border)] pt-5">
          <div className="flex justify-between">
            <Skeleton height="h-6" width="w-20" />
            <Skeleton height="h-6" width="w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────── */

const TransactionDetailPage = () => {
  const { id: storeId, txId } = useParams<{ id: string; txId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["transaction", txId],
    queryFn: () => transactionServiceApi.getById(txId as string),
    enabled: !!txId,
    select: (res) => res.data,
  });

  const goBack = () => navigate(`/store/${storeId}/transactions`);

  /* Loading */
  if (isLoading) return <DetailSkeleton />;

  /* Not found */
  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <LuArrowLeft size={16} />
          Back
        </Button>
        <EmptyState
          icon={<LuReceipt size={32} />}
          title="Transaction not found"
          description="This order may have been deleted or the link is invalid."
        />
      </div>
    );
  }

  /* ── Derive data ────────────────────────────────── */

  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Handle both response shapes (products or items)
  const items: OrderItem[] = order.products ?? order.items ?? [];

  const itemCount = items.reduce(
    (sum: number, item: OrderItem) => sum + (item.quantity ?? 1),
    0
  );

  const grandTotal = items.reduce(
    (sum: number, item: OrderItem) =>
      sum + getItemPrice(item) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={goBack}>
        <LuArrowLeft size={16} />
        Back
      </Button>

      {/* Receipt card */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] p-[var(--card-padding)] space-y-5">
        {/* ── Header ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
              {order.orderNumber}
            </h1>
            <Badge variant={toStatusBadgeVariant(order.status)}>
              {formatStatusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {formattedDate} · {formattedTime}
          </p>
        </div>

        {/* ── Order info ──────────────────────────── */}
        <Section title="Order Info">
          {order.type && (
            <InfoRow
              label="Type"
              value={formatOrderTypeLabel(order.type)}
            />
          )}
          {order.tableNumber && (
            <InfoRow label="Table" value={order.tableNumber} />
          )}
          {order.customerName && (
            <InfoRow label="Customer" value={order.customerName} />
          )}
          {order.deliveryPlatform && (
            <InfoRow label="Platform" value={order.deliveryPlatform} />
          )}
          <InfoRow
            label="Order ID"
            value={
              <span className="font-mono text-xs">
                #{order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id}
              </span>
            }
          />
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <InfoRow
              label="Last updated"
              value={new Date(order.updatedAt).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          )}
        </Section>

        {/* ── Items ───────────────────────────────── */}
        {items.length > 0 && (
          <Section title="Items">
            <div className="space-y-0">
              {items.map((item, index) => {
                const name = getItemName(item);
                const qty = item.quantity ?? 1;
                const lineTotal = getItemPrice(item) * qty;

                return (
                  <div
                    key={item.id || item.productId || index}
                    className={`flex justify-between gap-4 py-2.5 ${
                      index < items.length - 1
                        ? "border-b border-[var(--color-border)]"
                        : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--color-text-primary)]">
                        <span className="tabular-nums text-[var(--color-text-secondary)]">
                          {qty}x
                        </span>{" "}
                        {name}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] line-clamp-2">
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium tabular-nums text-[var(--color-text-primary)] shrink-0 pt-px">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Summary ─────────────────────────────── */}
        <Section title="Summary">
          <div className="flex justify-between items-baseline py-1.5">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </span>
            <span className="text-sm tabular-nums text-[var(--color-text-primary)]">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          <div className="border-t border-[var(--color-border)] mt-2 pt-3 flex justify-between items-baseline">
            <span className="text-base font-semibold text-[var(--color-text-primary)]">
              Total
            </span>
            <span className="text-xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </Section>

        {/* ── Payment ─────────────────────────────── */}
        {(order.paymentMethod || order.method || order.receiptId) && (
          <Section title="Payment">
            {(order.paymentMethod || order.method) && (
              <InfoRow
                label="Method"
                value={order.paymentMethod || order.method}
              />
            )}
            {order.receiptId && (
              <InfoRow
                label="Receipt"
                value={
                  <span className="font-mono text-xs">#{order.receiptId}</span>
                }
              />
            )}
          </Section>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
