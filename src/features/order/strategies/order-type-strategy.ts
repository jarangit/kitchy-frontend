/**
 * Strategy pattern for OrderType (DINE_IN / TOGO / DELIVERY).
 *
 * Centralises the per-type differences previously duplicated across POS,
 * KDS, and receipt components:
 *  - which extra fields the order requires,
 *  - which cart fields should be cleared when switching types,
 *  - which metadata to surface on the order card / receipt.
 *
 * Strategies are pure data/functions keyed by OrderType. Callers fetch
 * a strategy via `getOrderTypeStrategy(type)` and use its methods.
 */
import type { OrderType } from "@/features/pos/types/pos.model";

/**
 * Subset of cart fields the strategy may reset when switching types.
 * We don't import CartState directly to keep this module free of React
 * state coupling -- the cart context just merges the returned patch.
 */
export interface OrderTypeStateSlice {
  tableNumber: string | null;
  customerName: string;
  deliveryPlatform: string;
}

/**
 * Minimum shape required to describe an existing order to the strategy
 * when it formats info for a card or receipt. Richer order types can be
 * passed in via structural typing.
 */
export interface OrderTypeInfoSource {
  orderType?: OrderType;
  tableNumber?: string | null;
  customerName?: string | null;
  deliveryPlatform?: string | null;
}

export interface OrderTypeStrategy {
  readonly key: OrderType;
  /** i18n key for the human label ("pos.orderType.dine_in"). */
  readonly labelKey: string;
  /**
   * Fields the user must provide before the order is valid for this type.
   * Used by confirm-button enable logic.
   */
  readonly requiredFields: ReadonlyArray<keyof OrderTypeStateSlice>;
  /**
   * Returns the cart state patch to apply when switching to this type.
   * Every field not in the patch keeps its current value.
   */
  stateOnSwitch(): Partial<OrderTypeStateSlice>;
  /**
   * Validates that the given cart slice satisfies this type's requirements.
   */
  isValid(slice: OrderTypeStateSlice): boolean;
  /**
   * Returns a short secondary line (e.g. "Table 5", "GrabFood") to render
   * alongside the order's primary identifier. Null when no extra info
   * applies (e.g. TOGO without a customer name).
   */
  secondaryLine(source: OrderTypeInfoSource): string | null;
}

const dineInStrategy: OrderTypeStrategy = {
  key: "DINE_IN",
  labelKey: "pos.orderType.dine_in",
  requiredFields: ["tableNumber"],
  stateOnSwitch: () => ({
    customerName: "",
    deliveryPlatform: "",
  }),
  isValid: (slice) => !!slice.tableNumber,
  secondaryLine: (source) =>
    source.tableNumber ? `Table ${source.tableNumber}` : null,
};

const togoStrategy: OrderTypeStrategy = {
  key: "TOGO",
  labelKey: "pos.orderType.togo",
  requiredFields: [],
  stateOnSwitch: () => ({
    tableNumber: null,
    customerName: "",
    deliveryPlatform: "",
  }),
  isValid: () => true,
  secondaryLine: (source) => source.customerName?.trim() || null,
};

const deliveryStrategy: OrderTypeStrategy = {
  key: "DELIVERY",
  labelKey: "pos.orderType.delivery",
  requiredFields: ["deliveryPlatform"],
  stateOnSwitch: () => ({
    tableNumber: null,
    customerName: "",
  }),
  isValid: (slice) => slice.deliveryPlatform.trim().length > 0,
  secondaryLine: (source) => source.deliveryPlatform?.trim() || null,
};

export const orderTypeStrategies: Record<OrderType, OrderTypeStrategy> = {
  DINE_IN: dineInStrategy,
  TOGO: togoStrategy,
  DELIVERY: deliveryStrategy,
};

export const getOrderTypeStrategy = (type: OrderType): OrderTypeStrategy =>
  orderTypeStrategies[type];
