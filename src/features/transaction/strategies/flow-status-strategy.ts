/**
 * Strategy pattern for transaction flow status.
 *
 * Consolidates the per-FlowStatus differences previously expressed as
 * ternary chains inside `transaction-detail.tsx`:
 *   - which copy block to render (title + hint),
 *   - which action buttons are available,
 *   - which dot color to use in the hero.
 *
 * Each strategy is pure data. The page renders UI; the strategy decides
 * *what* to render.
 */
import type { FlowStatus } from "@/features/transaction/utils/transaction-formatters";

/**
 * Actions the flow strategy can expose on the hero action bar. Keep this
 * set minimal; add new values only when a concrete UI calls for it.
 */
export type FlowAction = "markReady" | "revert" | "edit" | "cancel";

export interface FlowStatusStrategy {
  readonly key: FlowStatus;
  /** i18n key for the title copy on the hero card. */
  readonly titleKey: string;
  /**
   * i18n key for the optional hint line shown below the title.
   * `null` means no hint is rendered.
   */
  readonly hintKey: string | null;
  /** CSS class applied to the status dot. */
  readonly dotClass: string;
  /** Whether the dot should pulse (active states). */
  readonly dotPulsing: boolean;
  /** Ordered list of actions to render in the action bar. */
  readonly actions: ReadonlyArray<FlowAction>;
}

const inProgressStrategy: FlowStatusStrategy = {
  key: "IN_PROGRESS",
  titleKey: "transaction.detail.state.inProgress",
  hintKey: "transaction.detail.state.inProgressHint",
  dotClass: "bg-accent",
  dotPulsing: true,
  actions: ["markReady", "edit", "cancel"],
};

const doneStrategy: FlowStatusStrategy = {
  key: "DONE",
  titleKey: "transaction.detail.state.done",
  hintKey: null,
  dotClass: "bg-success",
  dotPulsing: false,
  actions: ["revert", "edit", "cancel"],
};

const cancelledStrategy: FlowStatusStrategy = {
  key: "CANCELLED",
  titleKey: "transaction.detail.state.cancelled",
  hintKey: null,
  dotClass: "bg-border",
  dotPulsing: false,
  actions: [],
};

export const flowStatusStrategies: Record<FlowStatus, FlowStatusStrategy> = {
  IN_PROGRESS: inProgressStrategy,
  DONE: doneStrategy,
  CANCELLED: cancelledStrategy,
};

export const getFlowStatusStrategy = (status: FlowStatus): FlowStatusStrategy =>
  flowStatusStrategies[status];
