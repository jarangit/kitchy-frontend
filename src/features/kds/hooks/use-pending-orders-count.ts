import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useStationService } from "@/features/station/hooks/useStation";
import { orderApiService } from "@/features/order/services/order";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";

/**
 * Returns the total number of PENDING order-station-items across every
 * station in the current store. Polled every 5s (in sync with useKds).
 *
 * Cache keys match `useKds` (["kds-orders", stationId]) so when the user
 * is on the KDS page no duplicate requests are issued.
 */
export const usePendingOrdersCount = () => {
  const { stationsQuery } = useStationService({});

  const stations = useMemo(() => {
    return (stationsQuery ?? []) as Array<{ id: string }>;
  }, [stationsQuery]);

  const results = useQueries({
    queries: stations.map((station) => ({
      queryKey: ["kds-orders", station.id],
      queryFn: async () => {
        const response = await orderApiService.getOrderStationItemsByStationId(
          station.id
        );
        return response.data as unknown;
      },
      enabled: !!station.id,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    })),
  });

  const count = useMemo(() => {
    let total = 0;
    for (const result of results) {
      const items = unwrapPayload<IOrderStationItemDto>(result.data);
      for (const item of items) {
        if (item.status === "pending") total += 1;
      }
    }
    return total;
  }, [results]);

  const isLoading = results.length > 0 && results.some((r) => r.isLoading);

  return { count, isLoading };
};
