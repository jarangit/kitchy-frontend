import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTransactionService() {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const transactionsQuery = useQuery({
    queryKey: ["transactions", storeId],
    queryFn: () => transactionServiceApi.getByStoreId(storeId as string),
    enabled: !!storeId,
    select: (data) => data.data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      transactionServiceApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", storeId] });
      queryClient.invalidateQueries({ queryKey: ["transaction", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["transaction-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
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

/**
 * Fetches a single transaction (order) by id, and exposes its
 * associated mutations. Use this on the transaction detail page
 * instead of wiring useQuery + service directly.
 */
export function useTransactionDetail(transactionId?: string) {
  const queryClient = useQueryClient();
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const detailQuery = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionServiceApi.getById(transactionId as string),
    enabled: !!transactionId,
    select: (res) => res.data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      transactionServiceApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", storeId] });
      queryClient.invalidateQueries({ queryKey: ["transaction", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["transaction-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
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
