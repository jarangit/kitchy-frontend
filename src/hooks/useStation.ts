import { stationServiceApi } from "@/service/station";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ICreate {
  restaurantId: number;
  name: string;
  color?: string;
}
export function useStationService({
  stationId,
  restaurantId,
}: {
  stationId?: number;
  restaurantId?: number;
}) {
  const queryClient = useQueryClient();

  const stationsQuery = useQuery({
    queryKey: ["stations", restaurantId],
    queryFn: () => stationServiceApi.getByRestaurantId(restaurantId as number),
    enabled: !!restaurantId,
    select: (data) => data.data, // Assuming the API returns { data: [...] }
  });

  const stationFinOneQuery = useQuery({
    queryKey: ["station", stationId],
    queryFn: () => stationServiceApi.getById(stationId as number),
    enabled: !!stationId,
    select: (data) => data.data, // Assuming the API returns { data: {...} }
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
