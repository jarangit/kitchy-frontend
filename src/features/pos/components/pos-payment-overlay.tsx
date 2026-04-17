import { useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cartContext";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import PaymentSuccessDialog from "@/features/pos/components/payment-success-dialog";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { useTranslation } from "@/shared/i18n/use-translation";

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
  } = useCartContext();
  const { createMutation, ordersQuery } = useOrderService({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const change = useMemo(
    () =>
      paymentMethod === "CASH" && receivedAmount
        ? Math.max(0, Number(receivedAmount) - subtotal)
        : 0,
    [paymentMethod, receivedAmount, subtotal]
  );

  const canConfirm =
    items.length > 0 &&
    (paymentMethod !== "CASH" || Number(receivedAmount) >= subtotal) &&
    (orderType !== "DINE_IN" || !!tableNumber) &&
    (orderType !== "DELIVERY" || deliveryPlatform.trim().length > 0);

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

  const orderTypeLabel = t(`pos.orderType.${orderType.toLowerCase()}` as const);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClosePayment}
        className="!max-w-5xl w-[min(96vw,72rem)] max-h-[92vh] p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border bg-card-bg px-6 py-4">
          <h2 className="text-heading text-text-primary">
            {t("pos.payment.title")}
          </h2>
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
          <div className="overflow-y-auto max-h-[calc(92vh-72px)] p-6">
            <div className="gap-6 space-y-6 lg:grid lg:grid-cols-[1fr_320px] lg:space-y-0">
              <OrderSummary items={items} subtotal={subtotal} />

              <div className="rounded-card border border-card-border bg-card-bg p-card-padding">
                <h3 className="mb-3 text-title text-text-primary">
                  {t("pos.payment.orderInfo")}
                </h3>
                <dl className="mb-5 space-y-2 text-body-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-secondary">
                      {t("pos.payment.type")}
                    </dt>
                    <dd className="font-semibold text-text-primary">
                      {orderTypeLabel}
                    </dd>
                  </div>
                  {orderType === "DINE_IN" && (
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">
                        {t("pos.payment.table")}
                      </dt>
                      <dd className="font-semibold text-text-primary">
                        {tableNumber ?? "—"}
                      </dd>
                    </div>
                  )}
                  {orderType === "DELIVERY" && (
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">
                        {t("pos.payment.platform")}
                      </dt>
                      <dd className="font-semibold text-text-primary">
                        {deliveryPlatform || "—"}
                      </dd>
                    </div>
                  )}
                </dl>

                <h3 className="mb-3 text-title text-text-primary">
                  {t("pos.payment.method")}
                </h3>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
            </div>

            {paymentMethod === "CASH" && (
              <CashPaymentSection
                subtotal={subtotal}
                receivedAmount={receivedAmount}
                onReceivedAmountChange={setReceivedAmount}
                change={change}
              />
            )}

            {paymentMethod === "QR" && <QrPaymentSection subtotal={subtotal} />}

            {errorMessage && (
              <p className="mt-4 text-body-sm text-danger">{errorMessage}</p>
            )}

            {orderType === "DINE_IN" && !tableNumber && (
              <p className="mt-4 text-body-sm text-danger">
                {t("pos.payment.selectTableFirst")}
              </p>
            )}

            {orderType === "DELIVERY" && deliveryPlatform.trim().length === 0 && (
              <p className="mt-4 text-body-sm text-danger">
                {t("pos.payment.selectPlatformFirst")}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                onClick={handleClosePayment}
                className="h-12 flex-1"
                disabled={isProcessing}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirm || isProcessing}
                className="h-12 flex-1 text-subtitle"
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
