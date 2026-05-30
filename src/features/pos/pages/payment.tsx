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
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";

const CARD_CLASS = "rounded-card border border-card-border bg-card-bg p-4";

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
          <div className="min-h-0 lg:border-r lg:border-border lg:pr-4">
            <OrderSummary items={items} subtotal={subtotal} />
          </div>

          <div className="min-h-0 lg:pl-4">
            <div className="flex min-h-full flex-col lg:sticky lg:top-4">
              <section className={`${CARD_CLASS} space-y-4`}>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="gap-1.5"
                  >
                    <LuArrowLeft size={18} />
                    {t("pos.payment.backToPos")}
                  </Button>
                </div>

                <div className="space-y-1">
                  <p className="text-caption font-medium uppercase tracking-[0.08em] text-text-tertiary">
                    {t("pos.payment.title")}
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-title text-text-primary">{t("pos.payment.method")}</h1>
                      <p className="mt-1 text-body text-text-secondary">{nextStepHint}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-caption text-text-secondary">{t("pos.receipt.total")}</p>
                      <p className="text-heading font-semibold tabular-nums text-text-primary">
                        ฿{subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {orderMeta.map((value) => (
                    <span
                      key={value}
                      className="inline-flex rounded-full border border-card-border bg-bg px-3 py-1.5 text-label text-text-secondary"
                    >
                      {value}
                    </span>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} compact />
                </div>

                <div className="border-t border-border pt-4">
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

                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    {(errorMessage || validationMessage) && (
                      <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-body-sm text-danger">
                        {errorMessage ?? validationMessage}
                      </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
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
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
