/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";

export const orderApiService = {
  getOrdersByStoreId: async (storeId: string) => {
    return await axiosClient.get(`/orders/store/${storeId}`);
  },
  getById: async (orderId: string) => {
    return await axiosClient.get(`/orders/${orderId}`);
  },
  add: async (
    storeId: string,
    orderNumber: any,
    products: { productId: string; quantity: number }[]
  ) => {
    return await axiosClient.post(`/orders`, {
      storeId,
      orderNumber,
      products,
    });
  },
  update: async (orderId: string, orderData: any) => {
    return await axiosClient.put(`/orders/${orderId}`, orderData);
  },
  delete: async (orderId: string) => {
    return await axiosClient.delete(`/orders/${orderId}`);
  },
  getOrdersByStationId: async (stationId: string) => {
    return await axiosClient.get(`/orders/station/${stationId}`);
  },
};
