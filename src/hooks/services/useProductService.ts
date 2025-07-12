/* eslint-disable @typescript-eslint/no-explicit-any */
import { productApiService } from "@/service/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProductService(restaurantId: number) {
  const queryClient = useQueryClient();

  const menusQuery = useQuery({
    queryKey: ["products", restaurantId],
    queryFn: () => productApiService.geProductsByRestaurantId(restaurantId),
    enabled: !!restaurantId,
  });

  // CREATE
  const createMenuMutation = useMutation({
    mutationFn: (newMenu: any) => productApiService.createMenu(newMenu),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", restaurantId],
      });
    },
  });

  // UPDATE
  const updateMenuMutation = useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: any }) =>
      productApiService.updateMenu(menuId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", restaurantId],
      });
    },
  });

  // DELETE
  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: number) => productApiService.deleteMenu(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", restaurantId],
      });
    },
  });
  return {
    productsQuery: menusQuery?.data?.data,
    productsQueryLoading: menusQuery.isLoading,
    createMenuMutation,
    updateMenuMutation,
    deleteMenuMutation,
  };
}
