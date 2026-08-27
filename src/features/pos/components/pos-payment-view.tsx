import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { LuBanknote, LuQrCode } from "react-icons/lu";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import OrderSummary from "@/features/pos/components/order-summary";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import { usePromptpayQr } from "@/features/pos/hooks/usePromptpayQr";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  step: "SUMMARY" | "METHOD";
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  receivedAmount: string;
  onReceivedAmountChange: (value: string) => void;
}

export function PosPaymentView({
  step,
  paymentMethod,
  onPaymentMethodChange,
  receivedAmount,
  onReceivedAmountChange,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { items, subtotal } = useCartContext();

  const promptpayQr = usePromptpayQr(id, paymentMethod === "QR" ? subtotal : 0);
  const paymentStrategy = getPaymentStrategy(paymentMethod);

  const change = useMemo(
    () =>
      paymentStrategy.calcChange({
        total: subtotal,
        received: receivedAmount ? Number(receivedAmount) : undefined,
      }),
    [paymentStrategy, receivedAmount, subtotal],
  );

  if (step === "SUMMARY") {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-bg">
        <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
          <div className="flex h-full w-full flex-col px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <OrderSummary items={items} subtotal={subtotal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-bg">
      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <div className="flex min-h-full w-full flex-col px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div>
              <h2 className="text-subtitle text-text-primary">
                {t("pos.payment.method")}
              </h2>
              <div
                className="mt-3 grid grid-cols-2 gap-2 rounded-segment border border-segment-border bg-segment-bg p-1"
                role="group"
                aria-label={t("pos.payment.methodLabel")}
              >
                {(["QR", "CASH"] as const).map((method) => {
                  const selected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onPaymentMethodChange(method)}
                      className={cn(
                        "flex h-12 items-center justify-center gap-2 rounded-selection text-label font-medium transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35",
                        selected
                          ? "bg-segment-active-bg text-segment-active-text"
                          : "text-segment-inactive-text hover:text-segment-inactive-text-hover",
                      )}
                    >
                      {method === "QR" ? (
                        <LuQrCode className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <LuBanknote className="h-5 w-5" aria-hidden="true" />
                      )}
                      {t(
                        method === "QR" ? "pos.payment.qr" : "pos.payment.cash",
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === "QR" ? (
              <div className="flex min-h-0 flex-1 items-stretch justify-center">
                <div className="flex w-full max-w-sm flex-1 items-stretch">
                  <QrPaymentSection
                    subtotal={subtotal}
                    qrDataUrl={promptpayQr.data?.qrDataUrl}
                    promptpayId={promptpayQr.data?.promptpayId}
                    className="border-0 bg-transparent p-0"
                    embedded
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 items-stretch">
                <div className="flex w-full flex-1 items-stretch">
                  <CashPaymentSection
                    subtotal={subtotal}
                    receivedAmount={receivedAmount}
                    onReceivedAmountChange={onReceivedAmountChange}
                    change={change}
                    className="w-full border-0 bg-transparent p-0"
                    embedded
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PosPaymentView;
