/**
 * Strategy pattern for KDS card status transitions.
 *
 * Keyed by `KdsStatus` to centralise the "what comes next?" question that
 * was previously hard-coded inside `kds-order-card.tsx` and `useKds.ts`.
 *
 * Designed so a future `COOKING` state can be inserted without touching
 * any consumer: add a row to `kdsStatusStrategies` and the UI adapts.
 */
import type { KdsStatus } from "@/features/kds/types/kds.model";

export interface KdsStatusStrategy {
  readonly key: KdsStatus;
  readonly labelKey: string;
  /** Badge variant used when rendering the status as a chip. */
  readonly badgeVariant: "warning" | "success" | "info";
  /**
   * Next status in the happy-path flow. When the user toggles back, the
   * card falls back to the previous state via `fallback`.
   */
  readonly next: KdsStatus;
  /** i18n key for the button label that transitions to `next`. */
  readonly nextActionKey: string;
}

const pendingStrategy: KdsStatusStrategy = {
  key: "PENDING",
  labelKey: "kds.status.pending",
  badgeVariant: "warning",
  next: "READY",
  nextActionKey: "kds.card.markReady",
};

const readyStrategy: KdsStatusStrategy = {
  key: "READY",
  labelKey: "kds.status.ready",
  badgeVariant: "success",
  next: "SERVED",
  nextActionKey: "kds.card.markServed",
};

const servedStrategy: KdsStatusStrategy = {
  key: "SERVED",
  labelKey: "kds.status.served",
  badgeVariant: "info",
  next: "READY",
  nextActionKey: "kds.card.backToReady",
};

export const kdsStatusStrategies: Record<KdsStatus, KdsStatusStrategy> = {
  PENDING: pendingStrategy,
  READY: readyStrategy,
  SERVED: servedStrategy,
};

export const getKdsStatusStrategy = (status: KdsStatus): KdsStatusStrategy =>
  kdsStatusStrategies[status];
