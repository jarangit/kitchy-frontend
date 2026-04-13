import axiosClient from "@/shared/services/axios-client";
import type { ICreateStore, IUpdateStore } from "@/features/store/types/store.dto";

export const storeServiceApi = {
  getByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/stores/user/${userId}`);
    return response.data;
  },
  addStore: async (storeData: ICreateStore) => {
    const response = await axiosClient.post("/stores", storeData);
    return response.data;
  },
  getById: async (storeId: number) => {
    const response = await axiosClient.get(`/stores/${storeId}`);
    return response.data;
  },
  updateStore: async (
    storeId: number,
    storeData: IUpdateStore
  ) => {
    const response = await axiosClient.patch(
      `/stores/${storeId}`,
      storeData
    );
    return response.data;
  },
  deleteStore: async (storeId: number) => {
    const response = await axiosClient.delete(`/stores/${storeId}`);
    return response.data;
  },
};
