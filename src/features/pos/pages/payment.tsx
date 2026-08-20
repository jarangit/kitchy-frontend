import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuBanknote, LuQrCode } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { orderApiService } from "@/features/order/services/order";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import OrderSummary from "@/features/pos/components/order-summary";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import { usePromptpayQr } from "@/features/pos/hooks/usePromptpayQr";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { cn } from "@/shared/utils/cn";

type PaymentStep = "SUMMARY" | "PAYMENT";

const PAYMENT_METHOD_ICONS = {
  CASH: LuBanknote,
  QR: LuQrCode,
} as const;

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QR");
  const [step, setStep] = useState<PaymentStep>("SUMMARY");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const promptpayQr = usePromptpayQr(id, paymentMethod === "QR" ? subtotal : 0);

  const isDelivery = orderType === "DELIVERY";
  const paymentStrategy = getPaymentStrategy(paymentMethod);
  const orderTypeStrategy = getOrderTypeStrategy(orderType);
  const orderTypeLabel = t(orderTypeStrategy.labelKey as MessageKey);
  const paymentMethodOptions: Exclude<PaymentMethod, "DELIVERY_PLATFORM">[] = [
    "QR",
    "CASH",
  ];
  const nextStepHint =
    paymentMethod === "CASH"
      ? t("pos.payment.nextStepCash")
      : t("pos.payment.nextStepQr");
  const confirmLabel =
    paymentMethod === "QR"
      ? t("pos.payment.confirmQr")
      : t("pos.payment.confirm");
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
    [paymentStrategy, receivedAmount, subtotal],
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

  const canConfirmOrder =
    items.length > 0 &&
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
        : paymentMethod === "CASH" &&
            receivedAmount.trim().length > 0 &&
            Number(receivedAmount) < subtotal
          ? t("pos.payment.insufficientCash")
          : null;

  const handleCancel = () => {
    navigate(`/store/${id}/pos`);
  };

  const handleConfirmPayment = async (method: PaymentMethod) => {
    if (!canConfirm || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const methodChange = getPaymentStrategy(method).calcChange({
      total: subtotal,
      received: receivedAmount ? Number(receivedAmount) : undefined,
    });

    try {
      const orderNumber = getNextQueueNumber(ordersQuery);

      const createdResponse = await createMutation.mutateAsync({
        orderNumber,
        orderType,
        tableNumber:
          orderType === "DINE_IN" ? (tableNumber ?? undefined) : undefined,
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

      const createdOrder =
        "data" in createdResponse
          ? ((createdResponse.data as { data?: { id?: string }; id?: string })
              ?.data ?? createdResponse.data)
          : createdResponse;

      const orderId =
        createdOrder && typeof createdOrder === "object" && "id" in createdOrder
          ? createdOrder.id
          : undefined;

      let receiptId = orderNumber;
      if (orderId) {
        const payResponse = await orderApiService.pay(orderId, {
          method,
          amount: subtotal,
          receivedAmount: receivedAmount ? Number(receivedAmount) : undefined,
        });
        const payData =
          payResponse?.data?.data ?? payResponse?.data ?? payResponse;
        const payment = payData?.payment ?? payData;
        receiptId = payment?.receiptId ?? orderNumber;
      }

      setPaymentResult({
        receiptId,
        items: [...items],
        subtotal,
        paymentMethod: method,
        receivedAmount: Number(receivedAmount) || subtotal,
        change: methodChange,
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
          action={
            <Button onClick={handleCancel}>{t("pos.payment.backToPos")}</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-bg">
      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        {step === "SUMMARY" ? (
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col p-4">
            <Card
              as="section"
              padding="none"
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="flex min-h-0 flex-col">
                  <div className="shrink-0 border-b border-border p-4">
                    <div className="flex items-start justify-between gap-4">
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
                      <span className="rounded-full bg-bg px-3 py-1.5 text-caption text-text-tertiary">
                        {t("pos.payment.stepSummary")}
                      </span>
                    </div>

                    <div className="mt-4 min-w-0">
                      <h1 className="text-title text-text-primary">
                        {t("pos.payment.reviewTitle")}
                      </h1>
                      <p className="mt-1 text-body-sm leading-6 text-text-secondary">
                        {t("pos.payment.orderSummary")}
                      </p>

                      {orderMeta.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {orderMeta.map((value) => (
                            <span
                              key={value}
                              className="inline-flex rounded-full border border-card-border bg-bg px-3 py-1.5 text-label text-text-secondary"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-4 [-webkit-overflow-scrolling:touch]">
                    <OrderSummary items={items} subtotal={subtotal} />
                  </div>
                </section>

                <aside className="flex min-h-full flex-col justify-between gap-4 border-t border-border bg-card-bg p-4 lg:border-l lg:border-t-0">
                  <div>
                    <p className="text-caption font-medium uppercase tracking-widest text-text-tertiary">
                      {t("pos.payment.title")}
                    </p>
                    <h1 className="mt-1 text-subtitle text-text-primary">
                      {t("pos.payment.stepSummary")}
                    </h1>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-card border border-card-border bg-bg p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-label text-text-secondary">
                          {t("pos.receipt.total")}
                        </span>
                        <span className="text-title tabular-nums text-text-primary">
                          ฿{subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (isDelivery) {
                          handleConfirmPayment("DELIVERY_PLATFORM");
                        } else {
                          setStep("PAYMENT");
                        }
                      }}
                      className="h-16 w-full whitespace-normal text-center text-title leading-6"
                      loading={isProcessing}
                      loadingText={t("pos.payment.processing")}
                      disabled={
                        isDelivery ? !canConfirmOrder : items.length === 0
                      }
                    >
                      {isDelivery
                        ? t("pos.payment.confirmOrder")
                        : t("pos.payment.continueToPayment")}
                    </Button>
                  </div>
                </aside>
              </div>
            </Card>
          </div>
        ) : (
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col p-4">
            <Card
              as="section"
              padding="none"
              className="grid min-h-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]"
            >
              <section className="flex flex-col">
                <div className="shrink-0 border-b border-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("SUMMARY")}
                      className="-ml-2 gap-1.5 text-text-secondary"
                      disabled={isProcessing}
                    >
                      <LuArrowLeft size={18} />
                      {t("pos.payment.backToSummary")}
                    </Button>
                    <span className="rounded-full bg-bg px-3 py-1.5 text-caption text-text-tertiary">
                      {t("pos.payment.stepPayment")}
                    </span>
                  </div>

                  {orderMeta.length > 0 && (
                    <p className="mt-3 truncate text-body-sm text-text-secondary">
                      {orderMeta.join(" • ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-1 items-center justify-center p-6">
                  <div className="w-full max-w-xl">
                    {paymentMethod === "QR" ? (
                      <QrPaymentSection
                        subtotal={subtotal}
                        qrDataUrl={promptpayQr.data?.qrDataUrl}
                        promptpayId={promptpayQr.data?.promptpayId}
                        className="border-0 bg-transparent p-0"
                        embedded
                      />
                    ) : (
                      <CashPaymentSection
                        subtotal={subtotal}
                        receivedAmount={receivedAmount}
                        onReceivedAmountChange={setReceivedAmount}
                        change={change}
                        className="border-0 bg-transparent p-0"
                        embedded
                      />
                    )}
                  </div>
                </div>
              </section>

              <aside className="flex min-h-full flex-col justify-between gap-4 border-t border-border bg-card-bg p-4 lg:border-l lg:border-t-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-caption font-medium uppercase tracking-widest text-text-tertiary">
                      {t("pos.payment.title")}
                    </p>
                    <h1 className="mt-1 text-subtitle text-text-primary">
                      {t("pos.payment.method")}
                    </h1>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 rounded-segment border border-segment-border bg-segment-bg p-1"
                    role="group"
                    aria-label={t("pos.payment.methodLabel")}
                  >
                    {paymentMethodOptions.map((method) => {
                      const Icon = PAYMENT_METHOD_ICONS[method];
                      const selected = paymentMethod === method;

                      return (
                        <button
                          key={method}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setPaymentMethod(method)}
                          className={cn(
                            "flex h-12 items-center justify-center gap-2 rounded-selection text-label font-medium transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35",
                            selected
                              ? "bg-segment-active-bg text-segment-active-text"
                              : "text-segment-inactive-text hover:text-segment-inactive-text-hover",
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                          {t(
                            method === "QR"
                              ? "pos.payment.qr"
                              : "pos.payment.cash",
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="rounded-card bg-bg px-3 py-2 text-caption leading-5 text-text-secondary">
                    {nextStepHint}
                  </p>

                  {(errorMessage || validationMessage) && (
                    <InlineAlert tone={errorMessage ? "danger" : "warning"}>
                      {errorMessage ?? validationMessage}
                    </InlineAlert>
                  )}

                  <Button
                    onClick={() => handleConfirmPayment(paymentMethod)}
                    disabled={!canConfirm || isProcessing}
                    loading={isProcessing}
                    loadingText={t("pos.payment.processing")}
                    className="h-16 w-full whitespace-normal text-center text-title leading-6"
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </aside>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
