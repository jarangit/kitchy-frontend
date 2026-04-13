import axiosClient from "@/shared/services/axios-client";

export const transactionServiceApi = {
  getByStoreId: async (storeId: string) => {
    const response = await axiosClient.get(`/orders/store/${storeId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },
};
