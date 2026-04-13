import axiosClient from "@/shared/services/axios-client";
import type { ICreateStore, IUpdateStore } from "@/features/store/types/store.dto";

export const storeServiceApi = {
  getByUserId: async (userId: string) => {
    const response = await axiosClient.get(`/stores/user/${userId}`);
    return response.data;
  },
  addStore: async (storeData: ICreateStore) => {
    const response = await axiosClient.post("/stores", storeData);
    return response.data;
  },
  getById: async (storeId: string) => {
    const response = await axiosClient.get(`/stores/${storeId}`);
    return response.data;
  },
  updateStore: async (
    storeId: string,
    storeData: IUpdateStore
  ) => {
    const response = await axiosClient.patch(
      `/stores/${storeId}`,
      storeData
    );
    return response.data;
  },
  deleteStore: async (storeId: string) => {
    const response = await axiosClient.delete(`/stores/${storeId}`);
    return response.data;
  },
};
