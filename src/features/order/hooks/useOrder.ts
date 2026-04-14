/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderApiService } from "@/features/order/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { ICreateOrder } from "@/features/order/types/order.dto";

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
    queryFn: () =>
      orderApiService.getOrdersByStoreId(storeId as string),
    enabled: !!storeId,
    select: (data) => data.data,
  });

  const orderFindByStationIdQuery = useQuery({
    queryKey: ["ordersByStation", stationId],
    queryFn: () => orderApiService.getOrdersByStationId(stationId as string),
    enabled: !!stationId,
    select: (data) => data.data,
  });

  const orderFinOneQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApiService.getById(orderId as string),
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
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["order", storeId],
      }),
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
    ordersQuery: ordersQuery.data?.data,
    orderFinOneQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    orderFindByStationIdQuery,
    orderByStation: orderFindByStationIdQuery.data?.data,
    isLoading: ordersQuery.isLoading || orderFinOneQuery.isLoading,
  };
}
