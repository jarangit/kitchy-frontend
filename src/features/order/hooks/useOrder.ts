/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderApiService } from "@/features/order/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { ICreateOrder } from "@/features/order/types/order.dto";
import { AxiosError } from "axios";

const unwrapApiData = <T,>(response: any): T | undefined => {
  return response?.data?.data as T | undefined;
};

const toArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

const isNotFound = (error: unknown) => {
  return error instanceof AxiosError && error.response?.status === 404;
};

export function useOrderService({
  stationId,
  orderId,
}: {
  stationId?: string;
  orderId?: string;
}) {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  // READ
  const ordersQuery = useQuery({
    queryKey: ["orders", storeId],
    queryFn: async () => {
      try {
        const response = await orderApiService.getOrdersByStoreId(storeId as string);
        return toArray<any>(unwrapApiData<any>(response));
      } catch (error) {
        if (isNotFound(error)) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!storeId,
  });

  const orderFindByStationIdQuery = useQuery({
    queryKey: ["ordersByStation", stationId],
    queryFn: async () => {
      try {
        const response = await orderApiService.getOrdersByStationId(stationId as string);
        return toArray<any>(unwrapApiData<any>(response));
      } catch (error) {
        if (isNotFound(error)) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!stationId,
  });

  const orderFinOneQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await orderApiService.getById(orderId as string);
      return unwrapApiData<any>(response);
    },
    enabled: !!orderId,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: (data: ICreateOrder) =>
      orderApiService.add(
        storeId as string,
        data.orderNumber,
        data.products,
        data.orderType,
        data.tableNumber,
        data.customerName,
        data.deliveryPlatform
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders", storeId],
      }),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: string; orderData: any }) =>
      orderApiService.update(orderId, orderData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (orderId: string) => orderApiService.delete(orderId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders", storeId],
      }),
  });

  return {
    ordersQuery: ordersQuery.data ?? [],
    orderFinOneQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    orderFindByStationIdQuery,
    orderByStation: orderFindByStationIdQuery.data ?? [],
    isLoading: ordersQuery.isLoading || orderFinOneQuery.isLoading,
  };
}
