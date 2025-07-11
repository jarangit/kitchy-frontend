/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axios-client";

export const orderApiService = {
  getOrdersByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/orders/restaurant/${restaurantId}`);
  },
  getById: async (orderId: number) => {
    return await axiosClient.get(`/orders/${orderId}`);
  },
  add: async (restaurantId: number, orderData: any) => {
    return await axiosClient.post(
      `/orders/restaurant/${restaurantId}`,
      orderData
    );
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
