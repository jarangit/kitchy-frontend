import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useMutation } from "@tanstack/react-query";
import { appBus } from "@/shared/events/app-events";

type TransactionFlowStatus = "ALL" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export function useTransactionService(flowStatus: TransactionFlowStatus) {
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const transactionsQuery = useQuery({
    queryKey: ["transactions", storeId, flowStatus],
    queryFn: () =>
      transactionServiceApi.getByStoreId(storeId as string, { flowStatus }),
    enabled: !!storeId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      transactionServiceApi.update(id, payload),
    onSuccess: (_, variables) => {
      appBus.emit("transaction:updated", {
        transactionId: variables.id,
        storeId,
      });
    },
  });

  return {
    transactions: transactionsQuery.data,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
    refetch: transactionsQuery.refetch,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useTransactionCounts() {
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const countsQuery = useQuery({
    queryKey: ["transaction-counts", storeId],
    queryFn: () => transactionServiceApi.getCountsByStoreId(storeId as string),
    enabled: !!storeId,
  });

  return {
    counts: countsQuery.data,
    isLoading: countsQuery.isLoading,
    error: countsQuery.error,
  };
}

/**
 * Fetches a single transaction (order) by id, and exposes its
 * associated mutations. Use this on the transaction detail page
 * instead of wiring useQuery + service directly.
 */
export function useTransactionDetail(transactionId?: string) {
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const detailQuery = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionServiceApi.getById(transactionId as string),
    enabled: !!transactionId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      transactionServiceApi.update(id, payload),
    onSuccess: (_, variables) => {
      appBus.emit("transaction:updated", {
        transactionId: variables.id,
        storeId,
      });
    },
  });

  return {
    transaction: detailQuery.data,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
