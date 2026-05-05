/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/shared/services/axios-client";
import type { ApiResponse, OrderType } from "@/features/order/types/order.dto";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

type OrderProductPayload = { productId: string; quantity: number; note?: string };

const sanitizeProducts = (products: OrderProductPayload[]) =>
  products.map(({ productId, quantity }) => ({
    productId,
    quantity,
  }));

export const orderApiService = {
  getOrdersByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getOrdersByStoreId(storeId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<unknown> };
    }
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/store/${storeId}`);
  },
  getById: async (orderId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getOrderById(orderId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<unknown> };
    }
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/${orderId}`);
  },
  add: async (
    storeId: string,
    orderNumber: any,
    products: OrderProductPayload[],
    orderType: OrderType,
    tableNumber?: string,
    customerName?: string,
    deliveryPlatform?: string,
    deliveryOrderNumber?: string
  ) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).createOrder(storeId, orderNumber, products, orderType, tableNumber, customerName, deliveryPlatform, deliveryOrderNumber);
      return { data };
    }
    return await axiosClient.post(`/orders`, {
      storeId,
      orderNumber,
      products: sanitizeProducts(products),
      orderType,
      tableNumber,
      customerName,
      deliveryPlatform,
      deliveryOrderNumber,
    });
  },
  update: async (orderId: string, orderData: any) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).updateOrder(orderId, orderData);
      return { data };
    }
    return await axiosClient.patch(`/orders/${orderId}`, orderData);
  },
  delete: async (orderId: string) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).deleteOrder(orderId);
      return { data: { success: true, message: "ok", data: { message: "deleted" } } } as { data: ApiResponse<{ message: string }> };
    }
    return await axiosClient.delete<ApiResponse<{ message: string }>>(`/orders/${orderId}`);
  },
  getOrdersByStationId: async (stationId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getOrdersByStationId(stationId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<unknown> };
    }
    return await axiosClient.get<ApiResponse<unknown>>(`/orders/station/${stationId}`);
  },
  getOrderStationItemsByStationId: async (stationId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getOrderStationItemsByStationId(stationId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<unknown> };
    }
    return await axiosClient.get<ApiResponse<unknown>>(
      `/order-station-item/station/${stationId}`
    );
  },
  updateOrderStationItem: async (
    orderStationItemId: string,
    orderStationItemData: {
      status: "pending" | "complete" | "served";
      stationId: string;
      orderItemId: string;
    }
  ) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).updateOrderStationItem(orderStationItemId, orderStationItemData);
      return { data: {} };
    }
    return await axiosClient.patch(
      `/order-station-item/${orderStationItemId}`,
      orderStationItemData
    );
  },
};
