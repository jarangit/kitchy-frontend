import { useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import PaymentSuccessDialog from "@/features/pos/components/payment-success-dialog";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Dialog } from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PosPaymentOverlay = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const {
    items,
    subtotal,
    clearCart,
    setPaymentResult,
    paymentResult,
    clearPaymentResult,
    orderType,
    tableNumber,
    customerName,
    deliveryPlatform,
    deliveryOrderNumber,
  } = useCartContext();
  const { createMutation, ordersQuery } = useOrderService({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const paymentStrategy = getPaymentStrategy(paymentMethod);
  const orderTypeStrategy = getOrderTypeStrategy(orderType);

  const change = useMemo(
    () =>
      paymentStrategy.calcChange({
        total: subtotal,
        received: receivedAmount ? Number(receivedAmount) : undefined,
      }),
    [paymentStrategy, receivedAmount, subtotal]
  );

  const canConfirm =
    items.length > 0 &&
    paymentStrategy.canConfirm({
      total: subtotal,
      received: receivedAmount ? Number(receivedAmount) : undefined,
    }) &&
    orderTypeStrategy.isValid({
      tableNumber,
      customerName,
      deliveryPlatform,
      deliveryOrderNumber,
    });

  const handleClosePayment = () => {
    if (isProcessing) return;
    setErrorMessage(null);
    onClose();
  };

  const handleConfirmPayment = async () => {
    if (!canConfirm || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderNumber = getNextQueueNumber(ordersQuery);

      await createMutation.mutateAsync({
        orderNumber,
        orderType,
        tableNumber: orderType === "DINE_IN" ? tableNumber ?? undefined : undefined,
        customerName:
          orderType === "DELIVERY" ? customerName.trim() : undefined,
        deliveryPlatform:
          orderType === "DELIVERY" ? deliveryPlatform.trim() : undefined,
        deliveryOrderNumber:
          orderType === "DELIVERY" ? deliveryOrderNumber.trim() : undefined,
        products: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          note: item.note?.trim() || undefined,
        })),
      });

      setPaymentResult({
        receiptId: orderNumber,
        items: [...items],
        subtotal,
        paymentMethod,
        receivedAmount: Number(receivedAmount) || subtotal,
        change,
        orderType,
        tableNumber,
        customerName,
        deliveryPlatform,
        deliveryOrderNumber,
      });

      clearCart();
      onClose();
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage(t("pos.payment.failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    clearPaymentResult();
  };

  const orderTypeLabel = t(orderTypeStrategy.labelKey as MessageKey);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClosePayment}
        className="!max-w-6xl w-[min(96vw,76rem)] max-h-[92vh] overflow-hidden p-0"
      >
        <div className="flex flex-wrap items-start gap-4 border-b border-border bg-card-bg px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-title text-text-primary">
              {t("pos.payment.title")}
            </h2>
          </div>
          {items.length > 0 && (
            <div className="rounded-chip bg-chip-inactive-bg px-5 py-3 text-right">
              <p className="text-caption text-text-secondary">
                {t("pos.receipt.total")}
              </p>
              <p className="text-heading font-semibold tabular-nums text-text-primary">
                ฿{subtotal.toFixed(2)}
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClosePayment}
            aria-label={t("pos.payment.close")}
          >
            <LuX size={18} />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={t("pos.payment.emptyTitle")}
              description={t("pos.payment.emptyDescription")}
              action={
                <Button onClick={handleClosePayment}>
                  {t("pos.payment.backToPos")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex max-h-[calc(92vh-81px)] flex-col">
            <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="min-h-0 overflow-y-auto border-border p-6 lg:border-r">
                <OrderSummary items={items} subtotal={subtotal} />
              </div>

              <div className="min-h-0 overflow-y-auto bg-bg p-6">
                <div className="space-y-6">
                  <Card as="section">
                    <h3 className="mb-4 text-title text-text-primary">
                      {t("pos.payment.orderInfo")}
                    </h3>
                    <dl className="space-y-3 text-body">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <dt className="text-text-secondary">
                          {t("pos.payment.type")}
                        </dt>
                        <dd className="font-semibold text-text-primary sm:text-right">
                          {orderTypeLabel}
                        </dd>
                      </div>
                      {orderType === "DINE_IN" && (
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <dt className="text-text-secondary">
                            {t("pos.payment.table")}
                          </dt>
                          <dd className="font-semibold text-text-primary sm:text-right">
                            {tableNumber ?? "—"}
                          </dd>
                        </div>
                      )}
                      {orderType === "DELIVERY" && (
                        <>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <dt className="text-text-secondary">
                              {t("pos.payment.platform")}
                            </dt>
                            <dd className="font-semibold text-text-primary sm:text-right">
                              {deliveryPlatform || "—"}
                            </dd>
                          </div>
                          {deliveryOrderNumber.trim().length > 0 && (
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                              <dt className="text-text-secondary">
                                {t("pos.payment.deliveryOrderNumber")}
                              </dt>
                              <dd className="break-words font-semibold text-text-primary sm:max-w-[14rem] sm:text-right">
                                {deliveryOrderNumber.trim()}
                              </dd>
                            </div>
                          )}
                        </>
                      )}
                    </dl>
                  </Card>

                  <Card as="section">
                    <h3 className="mb-4 text-title text-text-primary">
                      {t("pos.payment.method")}
                    </h3>
                    <PaymentMethodSelector
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                    />
                  </Card>

                  {paymentMethod === "CASH" && (
                    <CashPaymentSection
                      subtotal={subtotal}
                      receivedAmount={receivedAmount}
                      onReceivedAmountChange={setReceivedAmount}
                      change={change}
                      className="mt-0"
                    />
                  )}

                  {paymentMethod === "QR" && (
                    <QrPaymentSection subtotal={subtotal} className="mt-0" />
                  )}

                  <div className="space-y-3">
                    {errorMessage && (
                      <InlineAlert tone="danger">
                        {errorMessage}
                      </InlineAlert>
                    )}

                    {orderType === "DINE_IN" && !tableNumber && (
                      <InlineAlert tone="danger">
                        {t("pos.payment.selectTableFirst")}
                      </InlineAlert>
                    )}

                    {orderType === "DELIVERY" && deliveryPlatform.trim().length === 0 && (
                      <InlineAlert tone="danger">
                        {t("pos.payment.selectPlatformFirst")}
                      </InlineAlert>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card-bg p-5 sm:flex-row sm:gap-4">
              <Button
                variant="secondary"
                onClick={handleClosePayment}
                className="flex-1 whitespace-normal"
                disabled={isProcessing}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirm || isProcessing}
                className="flex-[2] whitespace-normal text-center text-title leading-6"
              >
                {isProcessing
                  ? t("pos.payment.processing")
                  : t("pos.payment.payAmount", {
                      amount: `฿${subtotal.toFixed(2)}`,
                    })}
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <PaymentSuccessDialog
        open={isSuccessOpen}
        onClose={handleCloseSuccess}
        paymentResult={paymentResult}
      />
    </>
  );
};

export default PosPaymentOverlay;
