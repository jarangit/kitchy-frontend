import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "@/features/order/services/order";
import { useOrderService } from "@/features/order/hooks/useOrder";
import type { IKdsOrderDto } from "@/features/kds/types/kds.dto";
import type { KdsOrder, KdsStatus } from "@/features/kds/types/kds.model";
import { useAppSelector } from "@/shared/hooks/hooks";

const VALID_KDS_STATUS: KdsStatus[] = ["PENDING", "COOKING", "READY"];

const normalizeStatus = (status: string): KdsStatus => {
  if (VALID_KDS_STATUS.includes(status as KdsStatus)) {
    return status as KdsStatus;
  }
  return "PENDING";
};

export const useKds = (stationId?: string) => {
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;
  const { updateMutation } = useOrderService({});

  const ordersQuery = useQuery({
    queryKey: ["kds-orders", storeId],
    queryFn: async () => {
      const response = await orderApiService.getOrdersByStoreId(storeId as string);
      return response.data?.data as IKdsOrderDto[];
    },
    enabled: !!storeId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const orders = useMemo<KdsOrder[]>(() => {
    const rawOrders = ordersQuery.data ?? [];

    return rawOrders
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: normalizeStatus(order.status),
        orderType: order.orderType ?? order.type,
        tableNumber: order.tableNumber,
        customerName: order.customerName,
        deliveryPlatform: order.deliveryPlatform,
        createdAt: order.createdAt,
        stationId: order.stationId,
        stationName: order.stationName,
        items:
          order.products?.map((item) => ({
            id: item.id ?? item.productId ?? "",
            name: item.name ?? `Product #${item.productId ?? "-"}`,
            quantity: item.quantity ?? 1,
            note: item.note,
          })) ?? [],
      }))
      .filter((order) => !stationId || order.stationId === stationId);
  }, [ordersQuery.data, stationId]);

  const updateStatus = async (orderId: string, status: KdsStatus) => {
    await updateMutation.mutateAsync({
      orderId,
      orderData: { status },
    });
    await ordersQuery.refetch();
  };

  return {
    orders,
    isLoading: ordersQuery.isLoading,
    isRefetching: ordersQuery.isRefetching,
    error: ordersQuery.error,
    updateStatus,
    isUpdating: updateMutation.isPending,
  };
};
