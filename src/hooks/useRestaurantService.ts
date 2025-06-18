import { restaurantServiceApi } from "@/service/restaurant";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRestaurantService({
  userId,
  restaurantId,
}: {
  userId?: number;
  restaurantId?: number;
}) {
  const queryClient = useQueryClient();

  // READ
  const restaurantsQuery = useQuery({
    queryKey: ["restaurants", userId],
    queryFn: () => restaurantServiceApi.getByUserId(userId as number),
    enabled: !!userId,
  });

  const restaurantFinOneQuery = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => restaurantServiceApi.getById(restaurantId as number),
    enabled: !!restaurantId,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: restaurantServiceApi.addRestaurant,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["restaurants", userId],
      }),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({
      restaurantId,
      restaurantData,
    }: {
      restaurantId: number;
      restaurantData: { name: string };
    }) => restaurantServiceApi.updateRestaurant(restaurantId, restaurantData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["restaurant", restaurantId],
      }),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (restaurantId: number) =>
      restaurantServiceApi.deleteRestaurant(restaurantId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["restaurants", userId],
      }),
  });

  const onGetErrors = (error: any) => {
    if (error?.response) {
      return error.response.data.message || error.response.statusText;
    }
  };
  return {
    restaurants: restaurantsQuery.data,
    restaurantsLoading: restaurantsQuery.isLoading,

    restaurantFinOneQuery: restaurantFinOneQuery.data,
    restaurantFinOneLoading: restaurantFinOneQuery.isLoading,
    restaurantFinOneQueryError: onGetErrors(restaurantFinOneQuery.error),

    createRestaurant: createMutation.mutate,
    createRestaurantLoading: createMutation.isPending,

    updateRestaurant: updateMutation.mutate,
    updateRestaurantLoading: updateMutation.isPending,

    deleteRestaurant: deleteMutation.mutate,
    deleteRestaurantLoading: deleteMutation.isPending,
    // updateFood: updateMutation.mutate,
    // updateLoading: updateMutation.isLoading,
    // deleteFood: deleteMutation.mutate,
    // deleteLoading: deleteMutation.isLoading,
  };
}
