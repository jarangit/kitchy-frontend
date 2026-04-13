/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";

export const orderApiService = {
  getOrdersByStoreId: async (storeId: number) => {
    return await axiosClient.get(`/orders/store/${storeId}`);
  },
  getById: async (orderId: number) => {
    return await axiosClient.get(`/orders/${orderId}`);
  },
  add: async (
    storeId: number,
    orderNumber: any,
    products: { productId: number; quantity: number }[]
  ) => {
    return await axiosClient.post(`/orders`, {
      storeId,
      orderNumber,
      products,
    });
  },
  update: async (orderId: number, orderData: any) => {
    return await axiosClient.put(`/orders/${orderId}`, orderData);
  },
  delete: async (orderId: number) => {
    return await axiosClient.delete(`/orders/${orderId}`);
  },
  getOrdersByStationId: async (stationId: number) => {
    return await axiosClient.get(`/orders/station/${stationId}`);
  },
};
