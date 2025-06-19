import { menuApiService } from "@/service/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMenuService(restaurantId: number) {
  const queryClient = useQueryClient();

  const menusQuery = useQuery({
    queryKey: ["menus", restaurantId],
    queryFn: () => menuApiService.getMenusByRestaurantId(restaurantId),
    enabled: !!restaurantId,
  });

  // CREATE
  const createMenuMutation = useMutation({
    mutationFn: (newMenu: any) => menuApiService.createMenu(newMenu),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menus", restaurantId],
      });
    },
  });

  // UPDATE
  const updateMenuMutation = useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: any }) =>
      menuApiService.updateMenu(menuId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menus", restaurantId],
      });
    },
  });

  // DELETE
  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: number) => menuApiService.deleteMenu(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menus", restaurantId],
      });
    },
  });
  return {
    menusQuery: menusQuery.data,
    createMenuMutation,
    updateMenuMutation,
    deleteMenuMutation,
  };
}
