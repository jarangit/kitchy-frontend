/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";
import type { ApiResponse, OrderType } from "@/features/order/types/order.dto";

type OrderProductPayload = { productId: string; quantity: number; note?: string };

const sanitizeProducts = (products: OrderProductPayload[]) =>
  products.map(({ productId, quantity }) => ({
    productId,
    quantity,
  }));

export const orderApiService = {
  getOrdersByStoreId: async (storeId: string) => {
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/store/${storeId}`);
  },
  getById: async (orderId: string) => {
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/${orderId}`);
  },
  add: async (
    storeId: string,
    orderNumber: any,
    products: OrderProductPayload[],
    orderType: OrderType,
    tableNumber?: string,
    customerName?: string,
    deliveryPlatform?: string
  ) => {
    return await axiosClient.post(`/orders`, {
      storeId,
      orderNumber,
      products: sanitizeProducts(products),
      orderType,
      tableNumber,
      customerName,
      deliveryPlatform,
    });
  },
  update: async (orderId: string, orderData: any) => {
    return await axiosClient.patch(`/orders/${orderId}`, orderData);
  },
  delete: async (orderId: string) => {
    return await axiosClient.delete<ApiResponse<{ message: string }>>(`/orders/${orderId}`);
  },
  getOrdersByStationId: async (stationId: string) => {
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/station/${stationId}`);
  },
};
