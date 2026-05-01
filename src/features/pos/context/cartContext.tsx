import { useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { ICartItem, OrderType } from "@/features/pos/types/pos.model";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { useAppSelector } from "@/shared/hooks/hooks";
import { onboardingStorage } from "@/features/onboarding/utils/onboarding-storage";
import { CartContext } from "@/features/pos/context/cart-context-value";
import type {
  CartContextValue,
  PaymentResult,
} from "@/features/pos/context/cart-context-value";

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
  const [deliveryOrderNumber, setDeliveryOrderNumberState] = useState("");

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
    setDeliveryOrderNumberState("");
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
    if ("deliveryOrderNumber" in patch)
      setDeliveryOrderNumberState(patch.deliveryOrderNumber ?? "");
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

  const setDeliveryOrderNumber = useCallback((value: string) => {
    setDeliveryOrderNumberState(value);
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
    deliveryOrderNumber,
    setOrderType,
    setTableNumber,
    setCustomerName,
    setDeliveryPlatform,
    setDeliveryOrderNumber,
    paymentResult,
    setPaymentResult,
    clearPaymentResult,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
