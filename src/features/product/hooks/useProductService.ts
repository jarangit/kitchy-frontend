/* eslint-disable @typescript-eslint/no-explicit-any */
import { productApiService } from "@/features/product/services/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProductService(storeId: string) {
  const queryClient = useQueryClient();

  const menusQuery = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => productApiService.getProductsByStoreId(storeId),
    enabled: !!storeId,
    select: (data) => data.data,
  });

  // CREATE
  const createMenuMutation = useMutation({
    mutationFn: (newMenu: any) => productApiService.createMenu(newMenu),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
      });
    },
  });

  // UPDATE
  const updateMenuMutation = useMutation({
    mutationFn: ({ menuId, data }: { menuId: string; data: any }) =>
      productApiService.updateMenu(menuId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
      });
    },
  });

  // DELETE
  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: string) => productApiService.deleteMenu(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
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
