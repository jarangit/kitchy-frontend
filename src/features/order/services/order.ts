/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";

export const orderApiService = {
  getOrdersByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/orders/restaurant/${restaurantId}`);
  },
  getById: async (orderId: number) => {
    return await axiosClient.get(`/orders/${orderId}`);
  },
  add: async (
    restaurantId: number,
    orderNumber: any,
    products: { productId: number; quantity: number }[]
  ) => {
    return await axiosClient.post(`/orders`, {
      restaurantId,
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
