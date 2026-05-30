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

  const orderTypeLabel = t(orderTypeStrategy.labelKey as MessageKey);

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
      <div className="border-b border-border bg-card-bg px-6 py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
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
            <h1 className="mt-4 text-title text-text-primary">{t("pos.payment.title")}</h1>
          </div>
          <div className="rounded-chip bg-chip-inactive-bg px-5 py-3 text-right">
            <p className="text-caption text-text-secondary">{t("pos.receipt.total")}</p>
            <p className="text-heading font-semibold tabular-nums text-text-primary">
              ฿{subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid min-h-full max-w-6xl lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-h-0 border-border p-6 lg:border-r">
            <OrderSummary items={items} subtotal={subtotal} />
          </div>

          <div className="min-h-0 bg-bg p-6">
            <div className="space-y-6">
              <section className="rounded-card border border-card-border bg-card-bg p-card-padding">
                <h2 className="mb-4 text-title text-text-primary">{t("pos.payment.orderInfo")}</h2>
                <dl className="space-y-3 text-body">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <dt className="text-text-secondary">{t("pos.payment.type")}</dt>
                    <dd className="font-semibold text-text-primary sm:text-right">{orderTypeLabel}</dd>
                  </div>

                  {orderType === "DINE_IN" && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <dt className="text-text-secondary">{t("pos.payment.table")}</dt>
                      <dd className="font-semibold text-text-primary sm:text-right">
                        {tableNumber ?? "-"}
                      </dd>
                    </div>
                  )}

                  {orderType === "DELIVERY" && (
                    <>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <dt className="text-text-secondary">{t("pos.payment.platform")}</dt>
                        <dd className="font-semibold text-text-primary sm:text-right">
                          {deliveryPlatform || "-"}
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
              </section>

              <section className="rounded-card border border-card-border bg-card-bg p-card-padding">
                <h2 className="mb-4 text-title text-text-primary">{t("pos.payment.method")}</h2>
                <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
              </section>

              {paymentMethod === "CASH" && (
                <CashPaymentSection
                  subtotal={subtotal}
                  receivedAmount={receivedAmount}
                  onReceivedAmountChange={setReceivedAmount}
                  change={change}
                  className="mt-0"
                />
              )}

              {paymentMethod === "QR" && <QrPaymentSection subtotal={subtotal} className="mt-0" />}

              <div className="space-y-3">
                {errorMessage && (
                  <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-body-sm text-danger">
                    {errorMessage}
                  </p>
                )}

                {orderType === "DINE_IN" && !tableNumber && (
                  <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-body-sm text-danger">
                    {t("pos.payment.selectTableFirst")}
                  </p>
                )}

                {orderType === "DELIVERY" && deliveryPlatform.trim().length === 0 && (
                  <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-body-sm text-danger">
                    {t("pos.payment.selectPlatformFirst")}
                  </p>
                )}
              </div>

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
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
