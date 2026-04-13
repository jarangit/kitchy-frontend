/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";

export const productApiService = {
  getProductsByStoreId: async (storeId: string) => {
    return await axiosClient.get(`/products/store/${storeId}`);
  },

  geProductById: async (MenuId: string) => {
    return await axiosClient.get(`/products/${MenuId}`);
  },

  createMenu: async (data: any) => {
    return await axiosClient.post("/products", data);
  },

  updateMenu: async (MenuId: string, data: any) => {
    return await axiosClient.put(`/products/${MenuId}`, data);
  },

  deleteMenu: async (MenuId: string) => {
    return await axiosClient.delete(`/products/${MenuId}`);
  },
};
