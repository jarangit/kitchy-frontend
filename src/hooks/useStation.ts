import { stationServiceApi } from "@/service/station";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ICreate {
  restaurantId: number;
  name: string;
}
export function useStationService({ restaurantId }: { restaurantId?: number }) {
  const queryClient = useQueryClient();

  const stationsQuery = useQuery({
    queryKey: ["stations", restaurantId],
    queryFn: () => stationServiceApi.getByRestaurantId(restaurantId as number),
    enabled: !!restaurantId,
  });

  const stationFinOneQuery = useQuery({
    queryKey: ["station", restaurantId],
    queryFn: () => stationServiceApi.getById(restaurantId as number),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: (data: ICreate) => stationServiceApi.add(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", restaurantId],
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
        queryKey: ["stations", restaurantId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (stationId: number) => stationServiceApi.delete(stationId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stations", restaurantId],
      }),
  });

  return {
    stationsQuery: stationsQuery.data,
    stationsQueryIsLoading:stationsQuery.isLoading,
    stationFinOneQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: stationsQuery.isLoading || stationFinOneQuery.isLoading,
    isError: stationsQuery.isError || stationFinOneQuery.isError,
    error: stationsQuery.error || stationFinOneQuery.error,
  };
}
