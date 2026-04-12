/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";

export const productApiService = {
  geProductsByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/products/restaurant/${restaurantId}`);
  },

  geProductById: async (MenuId: number) => {
    return await axiosClient.get(`/products/${MenuId}`);
  },

  createMenu: async (data: any) => {
    return await axiosClient.post("/products", data);
  },

  updateMenu: async (MenuId: number, data: any) => {
    return await axiosClient.put(`/products/${MenuId}`, data);
  },

  deleteMenu: async (MenuId: number) => {
    return await axiosClient.delete(`/products/${MenuId}`);
  },
};
