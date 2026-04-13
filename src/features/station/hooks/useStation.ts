import { stationServiceApi } from "@/features/station/services/station";
import type { ICreateStation } from "@/features/station/types/station.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";

export function useStationService({
  stationId,
}: {
  stationId?: string;
}) {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const stationsQuery = useQuery({
    queryKey: ["stations", storeId],
    queryFn: () => stationServiceApi.getByStoreId(storeId as string),
    enabled: !!storeId,
    select: (data) => data.data,
  });

  const stationFinOneQuery = useQuery({
    queryKey: ["station", stationId],
    queryFn: () => stationServiceApi.getById(stationId as string),
    enabled: !!stationId,
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<ICreateStation, "storeId">) =>
      stationServiceApi.add({
        storeId: storeId as string,
        ...data,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", stationId],
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      stationId,
      stationData,
    }: {
      stationId: string;
      stationData: { name: string };
    }) => stationServiceApi.update(stationId, stationData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", stationId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (stationId: string) => stationServiceApi.delete(stationId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", stationId],
      }),
  });

  return {
    stationsQuery: stationsQuery.data,
    stationsQueryIsLoading: stationsQuery.isLoading,
    stationFinOneQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: stationsQuery.isLoading || stationFinOneQuery.isLoading,
    isError: stationsQuery.isError || stationFinOneQuery.isError,
    error: stationsQuery.error || stationFinOneQuery.error,
  };
}
