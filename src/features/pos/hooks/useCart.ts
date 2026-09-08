import { useState, useCallback, useMemo } from "react";
import type { AddToCartInput, ICartItem } from "@/features/pos/types/pos.model";
import { areSelectionsEqual } from "@/shared/utils/modifier-selection";

const createCartItemId = () =>
  `cart-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function useCart() {
  const [items, setItems] = useState<ICartItem[]>([]);

  const addItem = useCallback((product: AddToCartInput) => {
    const selections = product.selections ?? [];
    const modifierTotal = product.modifierTotal ?? 0;
    const basePrice = product.basePrice ?? product.price;
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product.id &&
          areSelectionsEqual(item.selections, selections) &&
          !item.note?.trim(),
      );
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          cartItemId: createCartItemId(),
          productId: product.id,
          name: product.name,
          price: basePrice + modifierTotal,
          basePrice,
          modifierTotal,
          selections,
          quantity: 1,
          note: "",
        },
      ];
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  };
}
