import axiosClient from "@/shared/services/axios-client";
import {
  IS_DEMO_MODE,
  getAdapter,
} from "@/shared/services/adapters/data-adapter";
import type { ITransaction } from "@/features/transaction/types/transaction.model";

type PayloadResponse<T> = T | { data: T };

const unwrapPayload = <T>(response: PayloadResponse<T>): T => {
  return typeof response === "object" && response !== null && "data" in response
    ? (response as { data: T }).data
    : (response as T);
};

const normalizeTransaction = (transaction: ITransaction): ITransaction => {
  const items = transaction.products ?? transaction.items ?? [];
  const totalAmount =
    transaction.totalAmount ??
    transaction.amount ??
    items.reduce(
      (sum, item) =>
        sum + (item.total ?? (item.price ?? 0) * (item.quantity ?? 0)),
      0,
    );

  return {
    ...transaction,
    products: items,
    items,
    totalAmount,
  };
};

export const transactionServiceApi = {
  getByStoreId: async (
    storeId: string,
    filter?: { flowStatus?: 'ALL' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' },
  ) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).getTransactionsByStoreId({ storeId })
      : (
          await axiosClient.get(`/transactions`, {
            params: {
              storeId,
              ...(filter?.flowStatus ? { flowStatus: filter.flowStatus } : {}),
            },
          })
        ).data;

    return unwrapPayload<ITransaction[]>(response).map(normalizeTransaction);
  },

  getById: async (id: string) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).getTransactionById(id)
      : (await axiosClient.get(`/transactions/${id}`)).data;

    return normalizeTransaction(unwrapPayload<ITransaction>(response));
  },

  getCountsByStoreId: async (storeId: string) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).getTransactionsByStoreId({ storeId })
      : (await axiosClient.get(`/transactions/counts`, { params: { storeId } })).data;

    if (IS_DEMO_MODE) {
      const transactions = unwrapPayload<ITransaction[]>(response).map(normalizeTransaction);
      return transactions.reduce(
        (counts, tx) => {
          counts.all += 1;
          if (tx.status === "CANCELLED") counts.cancelled += 1;
          else if (tx.status === "READY" || tx.status === "COMPLETED") counts.done += 1;
          else counts.inProgress += 1;
          return counts;
        },
        { all: 0, inProgress: 0, done: 0, cancelled: 0 },
      );
    }

    return unwrapPayload<{
      all: number;
      inProgress: number;
      done: number;
      cancelled: number;
    }>(response);
  },

  update: async (id: string, payload: unknown) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).updateTransaction(id, payload)
      : (await axiosClient.patch(`/transactions/${id}`, payload)).data;

    return normalizeTransaction(unwrapPayload<ITransaction>(response));
  },
};
