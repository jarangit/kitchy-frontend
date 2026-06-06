import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    items,
    subtotal,
    clearCart,
    setPaymentResult,
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

  const paymentStrategy = getPaymentStrategy(paymentMethod);
  const orderTypeStrategy = getOrderTypeStrategy(orderType);
  const orderTypeLabel = t(orderTypeStrategy.labelKey as MessageKey);
  const nextStepHint =
    paymentMethod === "CASH"
      ? t("pos.payment.nextStepCash")
      : t("pos.payment.nextStepQr");
  const orderMeta = [
    orderTypeLabel,
    orderType === "DINE_IN" && tableNumber ? tableNumber : null,
    orderType === "DELIVERY" && deliveryPlatform.trim().length > 0
      ? deliveryPlatform.trim()
      : null,
    orderType === "DELIVERY" && deliveryOrderNumber.trim().length > 0
      ? deliveryOrderNumber.trim()
      : null,
  ].filter(Boolean) as string[];

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

  const validationMessage =
    orderType === "DINE_IN" && !tableNumber
      ? t("pos.payment.selectTableFirst")
      : orderType === "DELIVERY" && deliveryPlatform.trim().length === 0
        ? t("pos.payment.selectPlatformFirst")
        : paymentMethod === "CASH" && receivedAmount.trim().length > 0 && Number(receivedAmount) < subtotal
          ? t("pos.payment.insufficientCash")
          : null;

  const handleCancel = () => {
    navigate(`/store/${id}/pos`);
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
        customerName: orderType === "DELIVERY" ? customerName.trim() : undefined,
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
      navigate(`/store/${id}/pos/payment/success`, { replace: true });
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage(t("pos.payment.failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          title={t("pos.payment.emptyTitle")}
          description={t("pos.payment.emptyDescription")}
          action={<Button onClick={handleCancel}>{t("pos.payment.backToPos")}</Button>}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid min-h-full max-w-6xl gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-0">
          <div className="order-2 min-h-0 lg:order-1 lg:border-r lg:border-border lg:pr-4">
            <OrderSummary items={items} subtotal={subtotal} />
          </div>

          <div className="order-1 min-h-0 lg:order-2 lg:pl-4">
            <div className="flex min-h-full flex-col lg:sticky lg:top-4">
              <Card as="section" padding="sm" className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="-ml-2 gap-1.5 text-text-secondary"
                  >
                    <LuArrowLeft size={18} />
                    {t("pos.payment.backToPos")}
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-caption font-medium uppercase tracking-[0.08em] text-text-tertiary">
                    {t("pos.payment.title")}
                  </p>
                  <div className="rounded-card border border-accent/20 bg-accent/5 px-4 py-4">
                    <p className="text-body-sm font-medium text-text-secondary">
                      {t("pos.payment.amountDue")}
                    </p>
                    <p className="mt-1 text-display font-semibold tabular-nums text-text-primary">
                      ฿{subtotal.toFixed(2)}
                    </p>
                    {orderMeta.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {orderMeta.map((value) => (
                          <span
                            key={value}
                            className="inline-flex rounded-full border border-card-border bg-card-bg px-3 py-1.5 text-label text-text-secondary"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="mb-3">
                    <h1 className="text-title text-text-primary">{t("pos.payment.method")}</h1>
                    <p className="mt-1 text-body text-text-secondary">{nextStepHint}</p>
                  </div>
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                    compact
                    ariaLabel={t("pos.payment.methodLabel")}
                  />
                </div>

                <div>
                  {paymentMethod === "CASH" && (
                    <CashPaymentSection
                      subtotal={subtotal}
                      receivedAmount={receivedAmount}
                      onReceivedAmountChange={setReceivedAmount}
                      change={change}
                      className="border-0 bg-transparent p-0"
                      embedded
                    />
                  )}

                  {paymentMethod === "QR" && (
                    <QrPaymentSection subtotal={subtotal} className="border-0 bg-transparent p-0" embedded />
                  )}
                </div>

                <div className="sticky bottom-0 -mx-3 -mb-3 border-t border-border bg-card-bg px-3 py-3 sm:static sm:mx-0 sm:mb-0 sm:px-0 sm:pb-0">
                  <div className="space-y-3">
                    {(errorMessage || validationMessage) && (
                      <InlineAlert tone={errorMessage ? "danger" : "warning"}>
                        {errorMessage ?? validationMessage}
                      </InlineAlert>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="hidden flex-1 whitespace-normal sm:inline-flex"
                        disabled={isProcessing}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={handleConfirmPayment}
                        disabled={!canConfirm || isProcessing}
                        loading={isProcessing}
                        loadingText={t("pos.payment.processing")}
                        className="flex-[2] whitespace-normal text-center text-title leading-6"
                      >
                        {t("pos.payment.payAmount", {
                          amount: `฿${subtotal.toFixed(2)}`,
                        })}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
