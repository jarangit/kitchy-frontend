import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "@/features/transaction/services/transaction";

export function useTransactionService(storeId?: number) {
  const transactionsQuery = useQuery({
    queryKey: ["transactions", storeId],
    queryFn: () => transactionServiceApi.getByStoreId(storeId as number),
    enabled: !!storeId,
    select: (data) => data.data,
  });

  return {
    transactions: transactionsQuery.data,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
    refetch: transactionsQuery.refetch,
  };
}
