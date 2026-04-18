import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useStationService } from "@/features/station/hooks/useStation";
import { orderApiService } from "@/features/order/services/order";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";

/**
 * Unwrap Axios + API wrapper to the raw array.
 * Mirrors the logic in useKds so the query cache key shape matches.
 */
const unwrapPayload = (payload: unknown): IOrderStationItemDto[] => {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data;
    }
  }

  return [];
};

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
      const items = unwrapPayload(result.data);
      for (const item of items) {
        if (item.status !== "complete") total += 1;
      }
    }
    return total;
  }, [results]);

  const isLoading = results.length > 0 && results.some((r) => r.isLoading);

  return { count, isLoading };
};
