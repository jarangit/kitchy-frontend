/**
 * Strategy pattern for payment methods.
 *
 * Each `PaymentMethod` value has its own strategy table entry describing:
 *  - validation rules (e.g. cash requires received >= total, QR does not),
 *  - change calculation,
 *  - i18n keys for user-facing labels.
 *
 * Strategies return pure data/functions -- callers render UI themselves so
 * this module stays decoupled from React. Use `getPaymentStrategy(method)`
 * to resolve the strategy at the call site.
 */
import type { PaymentMethod } from "@/features/pos/types/pos.model";

export interface PaymentContext {
  /** Total amount to charge. */
  total: number;
  /** Amount received from the customer (cash only). */
  received?: number;
}

export interface PaymentStrategy {
  readonly key: PaymentMethod;
  /** i18n key for the human label ("pos.payment.cash"). */
  readonly labelKey: string;
  /** i18n key for the receipt label. May be identical to `labelKey`. */
  readonly receiptLabelKey: string;
  /**
   * Whether a `received` amount is required from the user before
   * confirmation (cash yes, QR no).
   */
  readonly requiresReceived: boolean;
  /**
   * Returns true when the context satisfies the strategy's rules and the
   * user is allowed to confirm payment. Keep this pure -- no side effects.
   */
  canConfirm(ctx: PaymentContext): boolean;
  /**
   * Amount to hand back to the customer. Non-cash strategies return 0.
   */
  calcChange(ctx: PaymentContext): number;
}

const cashStrategy: PaymentStrategy = {
  key: "CASH",
  labelKey: "pos.payment.cash",
  receiptLabelKey: "pos.payment.cash",
  requiresReceived: true,
  canConfirm: ({ total, received }) =>
    typeof received === "number" && received >= total,
  calcChange: ({ total, received }) =>
    typeof received === "number" ? Math.max(0, received - total) : 0,
};

const qrStrategy: PaymentStrategy = {
  key: "QR",
  labelKey: "pos.payment.qr",
  receiptLabelKey: "pos.payment.qr",
  requiresReceived: false,
  canConfirm: ({ total }) => total > 0,
  calcChange: () => 0,
};

export const paymentStrategies: Record<PaymentMethod, PaymentStrategy> = {
  CASH: cashStrategy,
  QR: qrStrategy,
};

export const getPaymentStrategy = (method: PaymentMethod): PaymentStrategy =>
  paymentStrategies[method];
