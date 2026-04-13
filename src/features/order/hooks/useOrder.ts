/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderApiService } from "@/features/order/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrderService({
  storeId,
  stationId,
  orderId,
}: {
  storeId?: string;
  stationId?: string;
  orderId?: string;
}) {
  const queryClient = useQueryClient();

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
    mutationFn: (data: {
      storeId: string;
      orderNumber: string;
      products: { productId: string; quantity: number }[];
    }) =>
      orderApiService.add(data.storeId, data.orderNumber, data.products),
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
