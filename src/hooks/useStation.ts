import { stationServiceApi } from "@/service/station";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ICreate {
  restaurantId: number;
  name: string;
}
export function useStationService({ stationId }: { stationId?: number }) {
  const queryClient = useQueryClient();

  const stationsQuery = useQuery({
    queryKey: ["stations", stationId],
    queryFn: () => stationServiceApi.getByRestaurantId(stationId as number),
    enabled: !!stationId,
  });

  const stationFinOneQuery = useQuery({
    queryKey: ["station", stationId],
    queryFn: () => stationServiceApi.getById(stationId as number),
    enabled: !!stationId,
  });

  const createMutation = useMutation({
    mutationFn: (data: ICreate) => stationServiceApi.add(data),
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
      stationId: number;
      stationData: { name: string };
    }) => stationServiceApi.update(stationId, stationData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", stationId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (stationId: number) => stationServiceApi.delete(stationId),
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
