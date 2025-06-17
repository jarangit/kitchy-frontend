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
        queryKey: ["restaurants", restaurantId],
      }),
  });

  // // UPDATE
  // const updateMutation = useMutation({
  //   mutationFn: updateFood,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods", restaurantId] }),
  // });

  // // DELETE
  // const deleteMutation = useMutation({
  //   mutationFn: deleteFood,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods", restaurantId] }),
  // });

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
    // updateFood: updateMutation.mutate,
    // updateLoading: updateMutation.isLoading,
    // deleteFood: deleteMutation.mutate,
    // deleteLoading: deleteMutation.isLoading,
  };
}
