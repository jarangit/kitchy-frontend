import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useInProgressTransactionsCount } from "@/features/transaction/hooks/use-in-progress-transactions-count";
import { usePendingOrdersCount } from "@/features/kds/hooks/use-pending-orders-count";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { readReadyToServeDismissed } from "@/features/kds/utils/ready-to-serve-dismissed";
import { appBus } from "@/shared/events/app-events";

/**
 * Counts that match the sidebar/nav badges.
 * Use this for both the sidebar and the home progress strip so numbers stay in sync.
 */
export function useStoreOverviewCounts() {
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const { count: inProgressTransactionsCount } =
    useInProgressTransactionsCount();
  const { count: pendingOrdersCount } = usePendingOrdersCount();
  const { items: readyToServeItems } = useReadyToServeItems();

  const [dismissed, setDismissed] = useState(() =>
    readReadyToServeDismissed(storeId),
  );

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
  }, [storeId]);

  useEffect(() => {
    return appBus.on("ui:readyToServeDismissed", () => {
      setDismissed(readReadyToServeDismissed(storeId));
    });
  }, [storeId]);

  const visibleReadyToServeCount = useMemo(
    () => readyToServeItems.filter((item) => !dismissed.has(item.id)).length,
    [readyToServeItems, dismissed],
  );

  return {
    openOrdersCount: inProgressTransactionsCount,
    kitchenPendingCount: pendingOrdersCount,
    readyToServeCount: visibleReadyToServeCount,
  };
}
