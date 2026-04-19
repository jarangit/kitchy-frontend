import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { ICartItem, OrderType, PaymentMethod } from "@/features/pos/types/pos.model";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { useAppSelector } from "@/shared/hooks/hooks";
import { onboardingStorage } from "@/features/onboarding/utils/onboarding-storage";

// --- Cart State ---
interface CartState {
  items: ICartItem[];
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemNote: (productId: string, note: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  orderType: OrderType;
  tableNumber: string | null;
  customerName: string;
  deliveryPlatform: string;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (tableNumber: string | null) => void;
  setCustomerName: (name: string) => void;
  setDeliveryPlatform: (platform: string) => void;
}

// --- Payment Result (persisted after successful payment) ---
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
}

interface CartContextValue extends CartState {
  paymentResult: PaymentResult | null;
  setPaymentResult: (result: PaymentResult) => void;
  clearPaymentResult: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const createCartItemId = () =>
  `cart-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const VALID_ORDER_TYPES: readonly OrderType[] = ["DINE_IN", "TOGO", "DELIVERY"];

function resolveInitialOrderType(storeId: string | null): OrderType {
  if (!storeId) return "TOGO";
  const stored = onboardingStorage.getShopType(storeId);
  if (stored && (VALID_ORDER_TYPES as readonly string[]).includes(stored)) {
    return stored as OrderType;
  }
  return "TOGO";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const currentStoreId = useAppSelector((s) => s.currentStore.storeId);
  const [items, setItems] = useState<ICartItem[]>([]);
  const [paymentResult, setPaymentResultState] = useState<PaymentResult | null>(null);
  const [orderType, setOrderTypeState] = useState<OrderType>(() =>
    resolveInitialOrderType(currentStoreId)
  );
  const [tableNumber, setTableNumberState] = useState<string | null>(null);
  const [customerName, setCustomerNameState] = useState("");
  const [deliveryPlatform, setDeliveryPlatformState] = useState("");

  const addItem = useCallback(
    (product: { id: string; name: string; price: number }) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...prev,
          {
            cartItemId: createCartItemId(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            note: "",
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const setItemNote = useCallback((productId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, note: note.trim() } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const setOrderType = useCallback((type: OrderType) => {
    setOrderTypeState(type);

    // Delegate field-reset rules to the OrderTypeStrategy so POS and cart
    // stay consistent with KDS / receipt expectations.
    const patch = getOrderTypeStrategy(type).stateOnSwitch();
    if ("tableNumber" in patch) setTableNumberState(patch.tableNumber ?? null);
    if ("customerName" in patch) setCustomerNameState(patch.customerName ?? "");
    if ("deliveryPlatform" in patch)
      setDeliveryPlatformState(patch.deliveryPlatform ?? "");
  }, []);

  const setTableNumber = useCallback((value: string | null) => {
    setTableNumberState(value);
  }, []);

  const setCustomerName = useCallback((value: string) => {
    setCustomerNameState(value);
  }, []);

  const setDeliveryPlatform = useCallback((value: string) => {
    setDeliveryPlatformState(value);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const setPaymentResult = useCallback((result: PaymentResult) => {
    setPaymentResultState(result);
  }, []);

  const clearPaymentResult = useCallback(() => {
    setPaymentResultState(null);
  }, []);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    setItemNote,
    clearCart,
    subtotal,
    totalItems,
    orderType,
    tableNumber,
    customerName,
    deliveryPlatform,
    setOrderType,
    setTableNumber,
    setCustomerName,
    setDeliveryPlatform,
    paymentResult,
    setPaymentResult,
    clearPaymentResult,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
