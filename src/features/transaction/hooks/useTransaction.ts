import { useQuery } from "@tanstack/react-query";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useMutation } from "@tanstack/react-query";
import { appBus } from "@/shared/events/app-events";

type TransactionFlowStatus = "ALL" | "IN_PROGRESS" | "DONE" | "CANCELLED";
type TransactionOrderType = "ALL" | "DINE_IN" | "TOGO" | "DELIVERY";
type TransactionDateRange = "ALL" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS";

export interface UseTransactionServiceFilter {
  search?: string;
  status?: TransactionFlowStatus;
  orderType?: TransactionOrderType;
  dateRange?: TransactionDateRange;
}

function getDateRangeBounds(dateRange?: TransactionDateRange): {
  startDate?: string;
  endDate?: string;
} {
  if (!dateRange || dateRange === "ALL") return {};
  const now = new Date();
  if (dateRange === "TODAY") {
    return {
      startDate: startOfDay(now).toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }
  if (dateRange === "YESTERDAY") {
    const d = subDays(now, 1);
    return {
      startDate: startOfDay(d).toISOString(),
      endDate: endOfDay(d).toISOString(),
    };
  }
  if (dateRange === "LAST_7_DAYS") {
    return {
      startDate: startOfDay(subDays(now, 6)).toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }
  return {};
}

function normalizeFlowStatus(
  status?: TransactionFlowStatus,
): "IN_PROGRESS" | "DONE" | "CANCELLED" | undefined {
  return status && status !== "ALL" ? status : undefined;
}

function normalizeOrderType(
  orderType?: TransactionOrderType,
): "DINE_IN" | "TOGO" | "DELIVERY" | undefined {
  return orderType && orderType !== "ALL" ? orderType : undefined;
}

export function useTransactionService(
  filter: UseTransactionServiceFilter | TransactionFlowStatus = "ALL",
) {
  const normalizedFilter: UseTransactionServiceFilter =
    typeof filter === "string" ? { status: filter } : filter;

  const { search, status, orderType, dateRange } = normalizedFilter;
  const { startDate, endDate } = getDateRangeBounds(dateRange);

  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const transactionsQuery = useQuery({
    queryKey: [
      "transactions",
      storeId,
      status ?? "ALL",
      search ?? "",
      orderType ?? "ALL",
      dateRange ?? "ALL",
      startDate ?? "",
      endDate ?? "",
    ],
    queryFn: () =>
      transactionServiceApi.getByStoreId(storeId as string, {
        flowStatus: normalizeFlowStatus(status),
        search: search?.trim() ? search.trim() : undefined,
        orderType: normalizeOrderType(orderType),
        startDate,
        endDate,
      }),
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

export function useTransactionCounts(filter?: UseTransactionServiceFilter) {
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const { search, orderType, dateRange } = filter ?? {};
  const { startDate, endDate } = getDateRangeBounds(dateRange);

  const countsQuery = useQuery({
    queryKey: [
      "transaction-counts",
      storeId,
      search ?? "",
      orderType ?? "ALL",
      dateRange ?? "ALL",
      startDate ?? "",
      endDate ?? "",
    ],
    queryFn: () =>
      transactionServiceApi.getCountsByStoreId(storeId as string, {
        search: search?.trim() ? search.trim() : undefined,
        orderType: normalizeOrderType(orderType),
        startDate,
        endDate,
      }),
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
