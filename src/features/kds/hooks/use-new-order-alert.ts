import { useEffect, useRef } from "react";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";
import { playNewOrderChime } from "@/features/kds/utils/play-new-order-chime";

interface Options {
  /** Alert sound master switch (persisted KDS preference). */
  enabled: boolean;
  /** Scope boundary -- usually the station ID. Changing it re-baselines. */
  scopeKey?: string;
  /**
   * True while the queue snapshot is not ready for the current scope
   * (initial load / station switch). Prevents treating an in-flight
   * empty query as a real "queue drained" state.
   */
  isSnapshotPending?: boolean;
}

/**
 * Plays the new-order chime when order IDs never seen before appear in
 * the pending queue.
 *
 * Seen IDs accumulate while mounted so an order that leaves and re-enters
 * PENDING (e.g. an item toggled READY back to PENDING) does not re-trigger
 * the alert. The first ready snapshot per scope is treated as baseline and
 * stays silent; alerts fire only for genuinely new arrivals afterwards.
 * Tracking continues even while disabled, so re-enabling never replays a
 * backlog.
 */
/**
 * Sentinel scope so the very first ready snapshot always re-baselines,
 * including when `scopeKey` itself starts out undefined.
 */
const UNSET_SCOPE = Symbol("kds-alert-unset-scope");

export const useNewOrderAlert = (
  groups: KdsOrderGroup[],
  { enabled, scopeKey, isSnapshotPending }: Options,
) => {
  const seenOrderIds = useRef<Set<string>>(new Set());
  const scopedKey = useRef<string | undefined | typeof UNSET_SCOPE>(
    UNSET_SCOPE,
  );

  useEffect(() => {
    if (isSnapshotPending) return;

    if (scopedKey.current !== scopeKey) {
      scopedKey.current = scopeKey;
      seenOrderIds.current = new Set(groups.map((group) => group.orderId));
      return;
    }

    const unseen = groups.filter(
      (group) => !seenOrderIds.current.has(group.orderId),
    );
    if (unseen.length === 0) return;

    for (const group of unseen) seenOrderIds.current.add(group.orderId);
    if (enabled) playNewOrderChime();
  }, [groups, enabled, scopeKey, isSnapshotPending]);
};
