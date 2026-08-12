import { useMemo } from "react";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import { toFlowStatus } from "@/features/transaction/utils/transaction-formatters";

/**
 * Returns the number of transactions currently in progress (flow status
 * IN_PROGRESS: not READY/COMPLETED and not CANCELLED) for the current store.
 *
 * Reuses the shared `["transactions", storeId]` cache so the badge stays in
 * sync with the transactions list. Intentional no polling: the query is
 * refreshed by the `transaction:updated` / `transaction:refunded` app-bus
 * events and on window focus.
 */
export const useInProgressTransactionsCount = () => {
  const { transactions } = useTransactionService();

  const count = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    return transactions.reduce(
      (total, tx) =>
        toFlowStatus(tx.status ?? "") === "IN_PROGRESS" ? total + 1 : total,
      0,
    );
  }, [transactions]);

  return { count };
};
