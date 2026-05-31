import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTransactionDetail } from "@/features/transaction/hooks/useTransaction";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { IconButton } from "@/shared/components/ui/icon-button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import {
  toStatusBadgeVariant,
  formatStatusLabel,
  formatOrderTypeLabel,
} from "@/shared/utils/status";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { LuMinus, LuPlus, LuReceipt } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { InfoCell } from "@/features/transaction/components/info-cell";
import { DetailSkeleton } from "@/features/transaction/components/detail-skeleton";
import {
  formatCurrency,
  getItemName,
  getItemPrice,
  toFlowStatus,
  type FlowStatus,
  type TransactionOrderItem,
} from "@/features/transaction/utils/transaction-formatters";
import {
  getFlowStatusStrategy,
  type FlowAction,
} from "@/features/transaction/strategies/flow-status-strategy";

interface EditableItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
}

const TransactionDetailPage = () => {
  const { id: storeId, txId } = useParams<{ id: string; txId: string }>();
  const { t } = useTranslation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);

  const {
    transaction: order,
    isLoading,
    refetch,
    updateTransaction,
    isUpdating,
  } = useTransactionDetail(txId);

  const items: TransactionOrderItem[] = order?.products ?? order?.items ?? [];

  const itemCount = items.reduce(
    (sum: number, item: TransactionOrderItem) => sum + (item.quantity ?? 1),
    0,
  );

  const grandTotal = items.reduce(
    (sum: number, item: TransactionOrderItem) =>
      sum + getItemPrice(item) * (item.quantity ?? 1),
    0,
  );

  const orderStatus = order?.status ?? "PENDING";
  const canEditOrder = order && orderStatus !== "CANCELLED";
  const flowStatus: FlowStatus = order
    ? toFlowStatus(orderStatus)
    : "IN_PROGRESS";

  const hasRemovedAllItems = useMemo(
    () => editableItems.every((item) => item.quantity <= 0),
    [editableItems],
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
      })),
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
      <div className="space-y-6">
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

  const flowStrategy = getFlowStatusStrategy(flowStatus);
  const stateCopy = {
    title:
      flowStatus === "DONE"
        ? t(flowStrategy.titleKey as MessageKey, { time: formattedTime })
        : t(flowStrategy.titleKey as MessageKey),
    hint: flowStrategy.hintKey
      ? t(flowStrategy.hintKey as MessageKey)
      : null,
  };

  const renderFlowAction = (action: FlowAction) => {
    switch (action) {
      case "markReady":
        return (
          <Button
            key={action}
            onClick={() => updateStatus("READY")}
            disabled={isUpdating}
          >
            {t("transaction.detail.nextAction.markReady")}
          </Button>
        );
      case "revert":
        return (
          <Button
            key={action}
            variant="secondary"
            onClick={() => updateStatus("PREPARING")}
            disabled={isUpdating}
          >
            {t("transaction.detail.nextAction.revert")}
          </Button>
        );
      case "edit":
        return (
          <Button
            key={action}
            variant="ghost"
            onClick={openEditDialog}
            disabled={isUpdating || !canEditOrder}
          >
            {t("transaction.detail.action.edit")}
          </Button>
        );
      case "cancel":
        return (
          <Button
            key={action}
            variant="ghost"
            onClick={() => updateStatus("CANCELLED")}
            disabled={isUpdating}
            className="text-danger hover:text-danger"
          >
            {t("transaction.detail.action.cancel")}
          </Button>
        );
    }
  };

  return (
    <>
      <div className="page-stack-tight">
        <PageHeader
          backTo={`/store/${storeId}/transactions`}
          title={order.orderNumber}
          subtitle={`${formattedDate} · ${formattedTime}`}
          action={
            <Badge variant={toStatusBadgeVariant(orderStatus)}>
              {formatStatusLabel(orderStatus)}
            </Badge>
          }
        />

        {/* Card 1: Hero action + order info */}
        <Card className="space-y-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full",
                flowStrategy.dotClass,
                flowStrategy.dotPulsing && "animate-pulse",
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-text-primary">
                {stateCopy.title}
              </p>
              {stateCopy.hint && (
                <p className="mt-1 text-body-sm text-text-secondary">
                  {stateCopy.hint}
                </p>
              )}
            </div>
          </div>

          {flowStrategy.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {flowStrategy.actions.map(renderFlowAction)}
            </div>
          )}

          <div className="page-grid grid grid-cols-2 border-t border-border pt-5 sm:grid-cols-3">
            {order.type && (
              <InfoCell
                label={t("transaction.detail.info.type")}
                value={formatOrderTypeLabel(order.type)}
              />
            )}
            {order.tableNumber && (
              <InfoCell
                label={t("transaction.detail.info.table")}
                value={order.tableNumber}
              />
            )}
            {order.customerName && (
              <InfoCell
                label={t("transaction.detail.info.customer")}
                value={order.customerName}
              />
            )}
            {order.deliveryPlatform && (
              <InfoCell
                label={t("transaction.detail.info.platform")}
                value={order.deliveryPlatform}
              />
            )}
            {order.deliveryOrderNumber && (
              <InfoCell
                label={t("transaction.detail.info.deliveryOrderNumber")}
                value={order.deliveryOrderNumber}
              />
            )}
            <InfoCell
              label={t("transaction.detail.info.orderId")}
              value={
                <span className="font-mono text-caption">
                  #
                  {order.id.length > 12
                    ? `${order.id.slice(0, 12)}...`
                    : order.id}
                </span>
              }
            />
          </div>
        </Card>

        {/* Card 2: Items */}
        {items.length > 0 && (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-caption font-semibold uppercase tracking-wider text-text-tertiary">
                {t("transaction.detail.section.items")}
              </h3>
              <Badge variant="default">
                {t("transaction.detail.items.badge", { count: itemCount })}
              </Badge>
            </div>
            <div className="space-y-0">
              {items.map((item, index) => {
                const name = getItemName(item);
                const qty = item.quantity ?? 1;
                const unitPrice = getItemPrice(item);
                const lineTotal = unitPrice * qty;

                return (
                  <div
                    key={item.id || item.productId || index}
                    className={cn(
                      "flex justify-between gap-4 py-3",
                      index < items.length - 1 && "border-b border-border",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm text-text-primary">
                        <span className="tabular-nums text-text-secondary">
                          {qty}x
                        </span>{" "}
                        {name}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 line-clamp-2 text-caption text-text-tertiary">
                          {t("transaction.detail.items.note", {
                            note: item.note,
                          })}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-body-sm font-medium tabular-nums text-text-primary">
                        {formatCurrency(lineTotal)}
                      </p>
                      <p className="text-caption tabular-nums text-text-tertiary">
                        {t("transaction.detail.items.unitPrice", {
                          price: unitPrice.toFixed(2),
                          qty,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Card 3: Summary */}
        <Card>
          <div className="flex justify-between items-baseline py-1">
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
        </Card>
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
                className="flex items-center justify-between gap-4 rounded-card border border-card-border px-4 py-3"
              >
                <p className="min-w-0 flex-1 truncate text-body-sm text-text-primary">
                  {item.name}
                </p>
                  <div className="inline-flex items-center gap-2 rounded-chip bg-chip-inactive-bg p-1.5">
                  <IconButton
                    aria-label={t("transaction.detail.edit.decrease")}
                    onClick={() =>
                      setEditableItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id
                            ? { ...it, quantity: Math.max(0, it.quantity - 1) }
                            : it,
                        ),
                      )
                    }
                    disabled={item.quantity <= 0}
                    size="md"
                  >
                    <LuMinus size={18} />
                  </IconButton>
                  <span className="min-w-8 text-center text-body tabular-nums text-text-primary">
                    {item.quantity}
                  </span>
                  <IconButton
                    aria-label={t("transaction.detail.edit.increase")}
                    onClick={() =>
                      setEditableItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id
                            ? { ...it, quantity: it.quantity + 1 }
                            : it,
                        ),
                      )
                    }
                    size="md"
                  >
                    <LuPlus size={18} />
                  </IconButton>
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
