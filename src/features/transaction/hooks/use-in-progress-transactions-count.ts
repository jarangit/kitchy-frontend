import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { useAppSelector } from "@/shared/hooks/hooks";

/**
 * Returns the number of transactions currently in progress (flow status
 * IN_PROGRESS: not READY/COMPLETED and not CANCELLED) for the current store.
 *
 * Uses the dedicated transaction counts endpoint so the nav badge does not
 * trigger the full transactions list query on every page.
 */
export const useInProgressTransactionsCount = () => {
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const countsQuery = useQuery({
    queryKey: ["transaction-counts", storeId],
    queryFn: () => transactionServiceApi.getCountsByStoreId(storeId as string),
    enabled: !!storeId,
  });

  const count = useMemo(
    () => countsQuery.data?.inProgress ?? 0,
    [countsQuery.data?.inProgress],
  );

  return { count };
};
