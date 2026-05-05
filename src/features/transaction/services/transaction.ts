import axiosClient from "@/shared/services/axios-client";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

export const transactionServiceApi = {
  getByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getTransactionsByStoreId({ storeId });
    const response = await axiosClient.get(`/orders/store/${storeId}`);
    return response.data;
  },

  getById: async (id: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getTransactionById(id);
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  update: async (id: string, payload: unknown) => {
    if (IS_DEMO_MODE) return (await getAdapter()).updateTransaction(id, payload);
    const response = await axiosClient.patch(`/orders/${id}`, payload);
    return response.data;
  },
};
