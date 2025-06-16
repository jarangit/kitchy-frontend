import { foodApiService } from "@/service/food";
import { useQuery } from "@tanstack/react-query";

export function useFoodService(restaurantId: number) {
  const foodsQuery = useQuery({
    queryKey: ["foods", restaurantId],
    queryFn: () => foodApiService.getFoodsByRestaurantId(restaurantId),
    enabled: !!restaurantId,
  });
  return {
    ...foodsQuery,
  };
}
