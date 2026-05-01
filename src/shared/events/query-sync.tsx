import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appBus } from "./app-events";

/**
 * Listens to domain events and translates them into cache invalidations.
 *
 * This decouples mutation hooks from knowing *which* queries depend on their
 * data. Mutation hooks emit a single intent ("order:created"), and this
 * provider fans the signal out to every cache that cares -- matching the
 * Observer pattern: subjects (mutations) are unaware of observers.
 *
 * Mount once near the top of the tree, inside QueryClientProvider.
 */
export function QuerySyncProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const offs: Array<() => void> = [];

    // Order lifecycle ------------------------------------------------------
    const invalidateOrderCaches = (storeId?: string) => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
      queryClient.invalidateQueries({ queryKey: ["ordersByStation"] });
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    };

    offs.push(
      appBus.on("order:created", ({ storeId }) => invalidateOrderCaches(storeId)),
      appBus.on("order:updated", ({ orderId, storeId }) => {
        invalidateOrderCaches(storeId);
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      }),
      appBus.on("order:deleted", ({ orderId, storeId }) => {
        invalidateOrderCaches(storeId);
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      }),
      appBus.on("order:statusChanged", ({ stationId }) => {
        // Specific station's KDS cache + roll-up badge count both live under
        // ["kds-orders", ...] so a broad invalidation keeps things in sync.
        queryClient.invalidateQueries({ queryKey: ["kds-orders", stationId] });
      }),
    );

    // Transaction lifecycle ------------------------------------------------
    offs.push(
      appBus.on("transaction:updated", ({ transactionId, storeId }) => {
        queryClient.invalidateQueries({ queryKey: ["transactions", storeId] });
        queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
        queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
      }),
      appBus.on("transaction:refunded", ({ transactionId, storeId }) => {
        queryClient.invalidateQueries({ queryKey: ["transactions", storeId] });
        queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
      }),
    );

    // Auth lifecycle -------------------------------------------------------
    offs.push(
      appBus.on("auth:login", () => {
        // Ensure stale state from the previous session is dropped.
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }),
      appBus.on("auth:logout", () => {
        queryClient.clear();
      }),
      appBus.on("auth:unauthorized", () => {
        queryClient.clear();
      }),
    );

    return () => {
      for (const off of offs) off();
    };
  }, [queryClient]);

  return <>{children}</>;
}
