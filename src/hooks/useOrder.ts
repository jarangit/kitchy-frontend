/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderApiService } from "@/service/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrderService({
  restaurantId,
  stationId,
  orderId,
}: {
  restaurantId?: number;
  stationId?: number;
  orderId?: number;
}) {
  const queryClient = useQueryClient();

  // READ
  const ordersQuery = useQuery({
    queryKey: ["orders", restaurantId],
    queryFn: () =>
      orderApiService.getOrdersByRestaurantId(restaurantId as number),
    enabled: !!restaurantId,
  });

  const orderFindByStationIdQuery = useQuery({
    queryKey: ["ordersByStation", stationId],
    queryFn: () => orderApiService.getOrdersByStationId(stationId as number),
    enabled: !!stationId,
  });

  const orderFinOneQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApiService.getById(orderId as number),
    enabled: !!orderId,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: (data: {
      restaurantId: number;
      orderNumber: string;
      products: { productId: number; quantity: number }[];
    }) =>
      orderApiService.add(data.restaurantId, data.orderNumber, data.products),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders", restaurantId],
      }),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: number; orderData: any }) =>
      orderApiService.update(orderId, orderData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["order", restaurantId],
      }),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (orderId: number) => orderApiService.delete(orderId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders", restaurantId],
      }),
  });

  return {
    ordersQuery,
    orderFinOneQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    orderFindByStationIdQuery,
    orderByStation: orderFindByStationIdQuery.data?.data,
    isLoading: ordersQuery.isLoading || orderFinOneQuery.isLoading,
  };
}
