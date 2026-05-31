import axiosClient from "@/shared/services/axios-client";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";
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
    items.reduce((sum, item) => sum + (item.total ?? (item.price ?? 0) * (item.quantity ?? 0)), 0);

  return {
    ...transaction,
    products: items,
    items,
    totalAmount,
  };
};

export const transactionServiceApi = {
  getByStoreId: async (storeId: string) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).getTransactionsByStoreId({ storeId })
      : (await axiosClient.get(`/orders/store/${storeId}`)).data;

    return unwrapPayload<ITransaction[]>(response).map(normalizeTransaction);
  },

  getById: async (id: string) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).getTransactionById(id)
      : (await axiosClient.get(`/orders/${id}`)).data;

    return normalizeTransaction(unwrapPayload<ITransaction>(response));
  },

  update: async (id: string, payload: unknown) => {
    const response = IS_DEMO_MODE
      ? await (await getAdapter()).updateTransaction(id, payload)
      : (await axiosClient.patch(`/orders/${id}`, payload)).data;

    return normalizeTransaction(unwrapPayload<ITransaction>(response));
  },
};
