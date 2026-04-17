import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import {
  toStatusBadgeVariant,
  formatStatusLabel,
  formatOrderTypeLabel,
} from "@/shared/utils/status";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { LuMinus, LuReceipt } from "react-icons/lu";
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

interface EditableItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
}

const DONE_STATUSES = ["READY", "COMPLETED"];

const getItemName = (item: OrderItem) =>
  item.name || item.product?.name || `Product #${item.productId ?? "?"}`;

const getItemPrice = (item: OrderItem) =>
  item.price ?? item.product?.price ?? 0;

const formatCurrency = (amount: number) => `฿${amount.toFixed(2)}`;

const toFlowStatus = (status: string): "IN_PROGRESS" | "DONE" | "CANCELLED" => {
  if (status === "CANCELLED") return "CANCELLED";
  if (DONE_STATUSES.includes(status)) return "DONE";
  return "IN_PROGRESS";
};

const FLOW_LABEL_KEY: Record<"IN_PROGRESS" | "DONE" | "CANCELLED", MessageKey> = {
  IN_PROGRESS: "transaction.detail.flow.inProgress",
  DONE: "transaction.detail.flow.done",
  CANCELLED: "transaction.detail.flow.cancelled",
};

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-5">
      {title && (
        <h3 className="mb-4 text-caption font-semibold uppercase tracking-wider text-text-tertiary">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-body-sm text-text-secondary">{label}</span>
      <span className="max-w-[60%] truncate text-right text-body-sm font-medium text-text-primary">
        {value}
      </span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton height="h-9" width="w-32" />
      <div className="space-y-6 rounded-card border border-card-border bg-card-bg p-card-padding">
        <div className="flex items-center justify-between">
          <Skeleton height="h-7" width="w-36" />
          <Skeleton height="h-6" width="w-20" />
        </div>
        <Skeleton height="h-4" width="w-48" />
        <div className="space-y-2 border-t border-border pt-6">
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-4" width="w-1/2" />
        </div>
      </div>
    </div>
  );
}

const TransactionDetailPage = () => {
  const { id: storeId, txId } = useParams<{ id: string; txId: string }>();
  const { t } = useTranslation();
  const { updateTransaction, isUpdating } = useTransactionService();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ["transaction", txId],
    queryFn: () => transactionServiceApi.getById(txId as string),
    enabled: !!txId,
    select: (res) => res.data,
  });

  const items: OrderItem[] = order?.products ?? order?.items ?? [];

  const itemCount = items.reduce(
    (sum: number, item: OrderItem) => sum + (item.quantity ?? 1),
    0
  );

  const grandTotal = items.reduce(
    (sum: number, item: OrderItem) =>
      sum + getItemPrice(item) * (item.quantity ?? 1),
    0
  );

  const canEditOrder = order && order.status !== "CANCELLED";
  const flowStatus = order ? toFlowStatus(order.status) : "IN_PROGRESS";

  const hasRemovedAllItems = useMemo(
    () => editableItems.every((item) => item.quantity <= 0),
    [editableItems]
  );

  const openEditDialog = () => {
    if (!order) return;
    setTableNumber(order.tableNumber ?? "");
    setEditableItems(
      items.map((item, index) => ({
        id: item.id ?? `${item.productId ?? "item"}-${index}`,
        productId: item.productId ?? item.id ?? `item-${index}`,
        name: getItemName(item),
        quantity: item.quantity ?? 1,
      }))
    );
    setIsEditOpen(true);
  };

  const updateStatus = async (status: "PREPARING" | "READY" | "CANCELLED") => {
    if (!order) return;
    await updateTransaction({
      id: order.id,
      payload: { status },
    });
    await refetch();
  };

  const saveOrderEdit = async () => {
    if (!order) return;
    const products = editableItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

    if (products.length === 0) {
      return;
    }

    await updateTransaction({
      id: order.id,
      payload: {
        tableNumber: tableNumber.trim() || undefined,
        products,
      },
    });

    setIsEditOpen(false);
    await refetch();
  };

  if (isLoading) return <DetailSkeleton />;

  if (!order) {
    return (
      <div className="space-y-8">
        <PageHeader
          backTo={`/store/${storeId}/transactions`}
          title={t("transaction.detail.notFound.title")}
        />
        <EmptyState
          icon={<LuReceipt size={32} />}
          title={t("transaction.detail.notFound.title")}
          description={t("transaction.detail.notFound.description")}
        />
      </div>
    );
  }

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

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          backTo={`/store/${storeId}/transactions`}
          title={order.orderNumber}
          subtitle={`${formattedDate} · ${formattedTime}`}
          action={
            <Badge variant={toStatusBadgeVariant(order.status)}>
              {formatStatusLabel(order.status)}
            </Badge>
          }
        />

        <div className="space-y-6 rounded-card border border-card-border bg-card-bg p-card-padding">
          <Section title={t("transaction.detail.section.status")}>
            <div className="mb-3 rounded-card border border-card-border bg-bg px-3 py-2 text-body-sm text-text-secondary">
              {t(FLOW_LABEL_KEY[flowStatus])}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => updateStatus("PREPARING")}
                disabled={isUpdating || flowStatus === "CANCELLED" || flowStatus === "IN_PROGRESS"}
              >
                {t("transaction.detail.action.preparing")}
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus("READY")}
                disabled={isUpdating || flowStatus === "CANCELLED" || flowStatus === "DONE"}
              >
                {t("transaction.detail.action.ready")}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => updateStatus("CANCELLED")}
                disabled={isUpdating || flowStatus === "CANCELLED"}
              >
                {t("transaction.detail.action.cancel")}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={openEditDialog}
                disabled={isUpdating || !canEditOrder}
              >
                {t("transaction.detail.action.edit")}
              </Button>
            </div>
          </Section>

          <Section title={t("transaction.detail.section.info")}>
            {order.type && (
              <InfoRow
                label={t("transaction.detail.info.type")}
                value={formatOrderTypeLabel(order.type)}
              />
            )}
            {order.tableNumber && (
              <InfoRow
                label={t("transaction.detail.info.table")}
                value={order.tableNumber}
              />
            )}
            {order.customerName && (
              <InfoRow
                label={t("transaction.detail.info.customer")}
                value={order.customerName}
              />
            )}
            {order.deliveryPlatform && (
              <InfoRow
                label={t("transaction.detail.info.platform")}
                value={order.deliveryPlatform}
              />
            )}
            <InfoRow
              label={t("transaction.detail.info.orderId")}
              value={
                <span className="font-mono text-caption">
                  #{order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id}
                </span>
              }
            />
          </Section>

          {items.length > 0 && (
            <Section title={t("transaction.detail.section.items")}>
              <div className="space-y-0">
                {items.map((item, index) => {
                  const name = getItemName(item);
                  const qty = item.quantity ?? 1;
                  const lineTotal = getItemPrice(item) * qty;

                  return (
                    <div
                      key={item.id || item.productId || index}
                      className={cn(
                        "flex justify-between gap-4 py-3",
                        index < items.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm text-text-primary">
                          <span className="tabular-nums text-text-secondary">{qty}x</span>{" "}
                          {name}
                        </p>
                        {item.note && (
                          <p className="mt-0.5 line-clamp-2 text-caption text-text-tertiary">
                            {t("transaction.detail.items.note", { note: item.note })}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 pt-px text-body-sm font-medium tabular-nums text-text-primary">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          <Section title={t("transaction.detail.section.summary")}>
            <div className="flex justify-between items-baseline py-2">
              <span className="text-body-sm text-text-secondary">
                {t("transaction.detail.summary.subtotal", { count: itemCount })}
              </span>
              <span className="text-body-sm tabular-nums text-text-primary">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <div className="mt-3 flex justify-between items-baseline border-t border-border pt-4">
              <span className="text-body font-semibold text-text-primary">
                {t("transaction.detail.summary.total")}
              </span>
              <span className="text-title font-semibold tabular-nums text-text-primary">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </Section>
        </div>
      </div>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("transaction.detail.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("transaction.detail.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label={t("transaction.detail.edit.table")}
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder={t("transaction.detail.edit.tablePlaceholder")}
          />

          <div className="space-y-2">
            <p className="text-label text-text-secondary">
              {t("transaction.detail.edit.items")}
            </p>
            {editableItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-card border border-card-border px-3 py-2"
              >
                <p className="min-w-0 flex-1 truncate text-body-sm text-text-primary">
                  {item.name}
                </p>
                <div className="inline-flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditableItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id
                            ? { ...it, quantity: Math.max(0, it.quantity - 1) }
                            : it
                        )
                      )
                    }
                  >
                    <LuMinus size={14} />
                  </Button>
                  <span className="min-w-6 text-center text-label tabular-nums text-text-primary">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditableItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id
                            ? { ...it, quantity: it.quantity + 1 }
                            : it
                        )
                      )
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {hasRemovedAllItems && (
            <p className="text-caption text-danger">
              {t("transaction.detail.edit.removedAll")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setIsEditOpen(false)}
            disabled={isUpdating}
          >
            {t("transaction.detail.edit.close")}
          </Button>
          <Button
            onClick={saveOrderEdit}
            disabled={isUpdating || hasRemovedAllItems}
          >
            {t("transaction.detail.edit.save")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default TransactionDetailPage;
