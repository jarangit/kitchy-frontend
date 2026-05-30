import { LuQrCode } from "react-icons/lu";
import type { PaymentResult } from "@/features/pos/context/cart-context-value";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";

interface Props {
  paymentResult: PaymentResult;
  dateLabel?: string;
  showOrderDetails?: boolean;
  className?: string;
}

const PaymentReceipt = ({
  paymentResult,
  dateLabel,
  showOrderDetails = false,
  className,
}: Props) => {
  const { t } = useTranslation();
  const {
    receiptId,
    items,
    subtotal,
    paymentMethod,
    receivedAmount,
    change,
    orderType,
    tableNumber,
    customerName,
    deliveryPlatform,
    deliveryOrderNumber,
  } = paymentResult;

  const paymentStrategy = getPaymentStrategy(paymentMethod);
  const orderTypeStrategy = getOrderTypeStrategy(orderType);
  const methodLabel = t(paymentStrategy.receiptLabelKey as MessageKey);

  return (
    <Card className={className}>
      <div className="pb-4 text-center">
        <p className="mb-1 text-caption uppercase tracking-[0.16em] text-text-tertiary">
          {t("pos.receipt.title")}
        </p>
        <p className="font-mono text-title text-text-primary">#{receiptId}</p>
        {dateLabel && (
          <p className="mt-1 text-label text-text-secondary">{dateLabel}</p>
        )}
      </div>

      <div className="space-y-2 border-t border-border pb-4 pt-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="grid grid-cols-[1fr_auto_auto] gap-2 text-label text-text-secondary"
          >
            <div>
              <span className="text-text-primary">{item.name}</span>
              {item.note && (
                <p className="mt-1 text-caption leading-5 text-text-tertiary">
                  {t("pos.receipt.note", { note: item.note })}
                </p>
              )}
            </div>
            <span className="text-right tabular-nums">x{item.quantity}</span>
            <span className="w-20 text-right tabular-nums">
              ฿{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pb-3 pt-3">
        <div className="flex justify-between font-semibold text-text-primary">
          <span>{t("pos.receipt.total")}</span>
          <span className="tabular-nums">฿{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-3 text-label">
        {showOrderDetails && (
          <>
            <div className="flex justify-between text-text-secondary">
              <span>{t("pos.receipt.orderType")}</span>
              <span className="text-text-primary">
                {t(orderTypeStrategy.labelKey as MessageKey)}
              </span>
            </div>
            {orderType === "DINE_IN" && tableNumber && (
              <div className="flex justify-between text-text-secondary">
                <span>{t("pos.receipt.table")}</span>
                <span className="text-text-primary">{tableNumber}</span>
              </div>
            )}
            {orderType === "DELIVERY" && customerName && (
              <div className="flex justify-between text-text-secondary">
                <span>{t("pos.receipt.customer")}</span>
                <span className="text-text-primary">{customerName}</span>
              </div>
            )}
            {orderType === "DELIVERY" && deliveryPlatform && (
              <div className="flex justify-between text-text-secondary">
                <span>{t("pos.receipt.platform")}</span>
                <span className="text-text-primary">{deliveryPlatform}</span>
              </div>
            )}
            {orderType === "DELIVERY" && deliveryOrderNumber && (
              <div className="flex justify-between text-text-secondary">
                <span>{t("pos.receipt.deliveryOrderNumber")}</span>
                <span className="text-text-primary">{deliveryOrderNumber}</span>
              </div>
            )}
          </>
        )}
        <div className="flex justify-between text-text-secondary">
          <span>{t("pos.receipt.paymentMethod")}</span>
          <span className="text-text-primary">{methodLabel}</span>
        </div>
        {paymentStrategy.requiresReceived && (
          <>
            <div className="flex justify-between text-text-secondary">
              <span>{t("pos.receipt.cashReceived")}</span>
              <span className="tabular-nums text-text-primary">
                ฿{receivedAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-success">
              <span>{t("pos.receipt.changeLabel")}</span>
              <span className="tabular-nums">฿{change.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-center text-label font-semibold text-text-primary">
          {t("pos.receipt.scanForDigital")}
        </p>
        <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-card border border-border bg-bg text-text-tertiary">
          <LuQrCode size={44} />
          <span className="text-caption">{t("pos.receipt.receiptQr")}</span>
        </div>
        <p className="mt-2 text-center text-caption text-text-tertiary">
          {t("pos.receipt.ref", { id: String(receiptId) })}
        </p>
      </div>
    </Card>
  );
};

export default PaymentReceipt;
