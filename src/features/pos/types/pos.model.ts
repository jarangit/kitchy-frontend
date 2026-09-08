import type { CartModifierSelection } from "@/shared/types/modifier";

export interface ICartItem {
  cartItemId: string;
  productId: string;
  name: string;
  /** Final unit price including modifiers (basePrice + modifierTotal). */
  price: number;
  basePrice: number;
  modifierTotal: number;
  selections: CartModifierSelection[];
  quantity: number;
  note?: string;
}

export interface AddToCartInput {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  modifierTotal?: number;
  selections?: CartModifierSelection[];
}

export type PaymentMethod = "CASH" | "QR" | "DELIVERY_PLATFORM";

export type OrderType = "DINE_IN" | "TOGO" | "DELIVERY";

export interface IPaymentInfo {
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number; // for cash
  change?: number;
}
