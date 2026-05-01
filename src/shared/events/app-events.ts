/**
 * Centralised typed event map for the app-wide event bus.
 *
 * When you add a new mutation or cross-feature signal, declare its payload
 * shape here so every emitter/subscriber shares a single source of truth.
 *
 * Naming convention: "<domain>:<pastTenseVerb>" (e.g. "order:created").
 */
import { createEventBus } from "./event-bus";
import type { KdsStatus } from "@/features/kds/types/kds.model";

export type AppEventMap = {
  "order:created": { orderId: string; storeId?: string };
  "order:updated": { orderId: string; storeId?: string };
  "order:deleted": { orderId: string; storeId?: string };
  "order:statusChanged": {
    orderStationItemId: string;
    from: KdsStatus;
    to: KdsStatus;
    stationId?: string;
  };
  "transaction:updated": { transactionId: string; storeId?: string };
  "transaction:refunded": { transactionId: string; storeId?: string };
  "auth:login": { userId?: string };
  "auth:logout": Record<string, never>;
  "auth:unauthorized": Record<string, never>;
  "ui:readyToServeRequested": Record<string, never>;
  "ui:readyToServeDismissed": { itemId: string };
};

/**
 * Singleton event bus. Use this instead of creating ad-hoc buses so that
 * every module talks through the same channel.
 */
export const appBus = createEventBus<AppEventMap>();
