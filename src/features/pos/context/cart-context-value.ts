import { createContext } from "react";
import type { ICartItem, OrderType, PaymentMethod } from "@/features/pos/types/pos.model";

interface CartState {
  items: ICartItem[];
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setItemNote: (cartItemId: string, note: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  orderType: OrderType;
  tableNumber: string | null;
  customerName: string;
  deliveryPlatform: string;
  deliveryOrderNumber: string;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (tableNumber: string | null) => void;
  setCustomerName: (name: string) => void;
  setDeliveryPlatform: (platform: string) => void;
  setDeliveryOrderNumber: (orderNumber: string) => void;
}

// Payment result is persisted after successful payment so the success page
// can survive route transitions without re-querying transaction detail.
export interface PaymentResult {
  receiptId: string;
  items: ICartItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  receivedAmount: number;
  change: number;
  orderType: OrderType;
  tableNumber: string | null;
  customerName: string;
  deliveryPlatform: string;
  deliveryOrderNumber: string;
}

export interface CartContextValue extends CartState {
  paymentResult: PaymentResult | null;
  setPaymentResult: (result: PaymentResult) => void;
  clearPaymentResult: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
