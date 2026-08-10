import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LuMinus, LuPlus, LuReceipt } from "react-icons/lu";
import { useTransactionDetail } from "@/features/transaction/hooks/useTransaction";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { IconButton } from "@/shared/components/ui/icon-button";
import { EmptyState } from "@/shared/components/ui/empty-state";
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
import { InfoCell } from "@/features/transaction/components/info-cell";
import { DetailSkeleton } from "@/features/transaction/components/detail-skeleton";
import {
  formatCurrency,
  getItemName,
  getItemPrice,
  getPaymentMethodLabelKey,
  toFlowStatus,
  type FlowStatus,
  type TransactionOrderItem,
} from "@/features/transaction/utils/transaction-formatters";
import { getFlowStatusStrategy } from "@/features/transaction/strategies/flow-status-strategy";
import { LuArrowLeft } from "react-icons/lu";

interface EditableItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
}

const TransactionDetailPage = () => {
  const { txId } = useParams<{ id: string; txId: string }>();
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
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const grandTotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity ?? 1),
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
    await updateTransaction({ id: order.id, payload: { status } });
    await refetch();
  };

  const saveOrderEdit = async () => {
    if (!order) return;
    const products = editableItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({ productId: item.productId, quantity: item.quantity }));
    if (products.length === 0) return;
    await updateTransaction({
      id: order.id,
      payload: { tableNumber: tableNumber.trim() || undefined, products },
    });
    setIsEditOpen(false);
    await refetch();
  };

  if (isLoading) return <DetailSkeleton />;

  if (!order) {
    return (
      <div className="space-y-6">
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
    hint: flowStrategy.hintKey ? t(flowStrategy.hintKey as MessageKey) : null,
  };

  const paymentMethodKey = getPaymentMethodLabelKey(order.method);
  const paymentMethodLabel =
    paymentMethodKey === "transaction.method.viaPlatform"
      ? t(paymentMethodKey, { platform: order.method })
      : paymentMethodKey
        ? t(paymentMethodKey)
        : "—";

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col bg-bg">
        <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col p-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-3 w-fit gap-1.5 px-0 text-text-secondary"
            >
              <LuArrowLeft size={18} />
              {t("common.back")}
            </Button>

            <Card
              as="section"
              padding="none"
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="flex min-h-0 flex-col">
                  <div className="shrink-0 border-b border-border p-4">
                    <div className="mt-4 flex items-start justify-between gap-4">
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
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-4 [-webkit-overflow-scrolling:touch]">
                    <div className="space-y-4">
                      {items.length > 0 && (
                        <Card>
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-caption font-semibold uppercase tracking-wider text-text-tertiary">
                              {t("transaction.detail.section.items")}
                            </h3>
                            <Badge variant="default">
                              {t("transaction.detail.items.badge", {
                                count: itemCount,
                              })}
                            </Badge>
                          </div>
                          <div className="space-y-4">
                            {items.map((item) => {
                              const name = getItemName(item);
                              const qty = item.quantity ?? 1;
                              const lineTotal = getItemPrice(item) * qty;

                              return (
                                <div
                                  key={item.id || item.productId || name}
                                  className="flex flex-col gap-2 text-body text-text-secondary sm:flex-row sm:items-start sm:justify-between"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span>
                                      {name} x{qty}
                                    </span>
                                    {item.note && (
                                      <p className="mt-1 text-body leading-6 text-text-tertiary">
                                        {t("transaction.detail.items.note", {
                                          note: item.note,
                                        })}
                                      </p>
                                    )}
                                  </div>
                                  <span className="shrink-0 tabular-nums text-text-primary sm:text-right">
                                    {formatCurrency(lineTotal)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-title">
                            <span>{t("transaction.detail.summary.total")}</span>
                            <span className="tabular-nums">
                              {formatCurrency(grandTotal)}
                            </span>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </section>

                <aside className="flex min-h-full flex-col justify-between gap-4 border-t border-border bg-card-bg p-4 lg:border-l lg:border-t-0">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-subtitle text-text-primary">
                        {order.orderNumber}
                      </h1>
                      <Badge variant={toStatusBadgeVariant(orderStatus)}>
                        {formatStatusLabel(orderStatus)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-body-sm text-text-secondary">
                      {formattedDate} · {formattedTime}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
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
                          label={t(
                            "transaction.detail.info.deliveryOrderNumber",
                          )}
                          value={order.deliveryOrderNumber}
                        />
                      )}
                      <InfoCell
                        label={t("transaction.detail.info.paymentMethod")}
                        value={paymentMethodLabel}
                      />
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

                    <div className="space-y-2">
                      <Button
                        variant="secondary"
                        onClick={openEditDialog}
                        disabled={isUpdating || !canEditOrder}
                        className="h-14 w-full whitespace-normal text-center text-body leading-6"
                      >
                        {t("transaction.detail.action.edit")}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => updateStatus("CANCELLED")}
                        disabled={isUpdating}
                        className="w-full text-danger hover:text-danger"
                      >
                        {t("transaction.detail.action.cancel")}
                      </Button>
                      <Button
                        onClick={() => updateStatus("READY")}
                        disabled={isUpdating}
                        className="h-14 w-full whitespace-normal text-center text-body leading-6"
                      >
                        {t("transaction.detail.nextAction.markReady")}
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </Card>
          </div>
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
