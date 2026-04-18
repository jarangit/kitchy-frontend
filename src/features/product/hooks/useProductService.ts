import { productApiService } from "@/features/product/services/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/features/product/types/product.dto";
import type { IMenu } from "@/features/product/types/product.model";

const isProductArray = (value: unknown): value is IMenu[] => {
  return Array.isArray(value);
};

const isNotFoundNoProductsError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const maybeResponse = error as {
    response?: { status?: number; data?: { message?: string } };
  };
  return (
    maybeResponse.response?.status === 404 &&
    maybeResponse.response?.data?.message?.includes("No products found")
  );
};

export function useProductService(selectedCategoryId?: string) {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const productsListQuery = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => productApiService.getProductsByStoreId(storeId as string),
    enabled: !!storeId,
    select: (response) => {
      const payload = response.data.data;
      return isProductArray(payload) ? payload : [];
    },
    retry: (failureCount, error) => {
      if (isNotFoundNoProductsError(error)) return false;
      return failureCount < 2;
    },
  });

  const productsByCategoryQuery = useQuery({
    queryKey: ["products", "category", selectedCategoryId],
    queryFn: () => productApiService.getProductsByCategoryId(selectedCategoryId as string),
    enabled: !!selectedCategoryId && selectedCategoryId !== "ALL",
    select: (response) => {
      const payload = response.data.data;
      return isProductArray(payload) ? payload : [];
    },
    retry: (failureCount, error) => {
      if (isNotFoundNoProductsError(error)) return false;
      return failureCount < 2;
    },
  });

  // CREATE
  const createProductMutation = useMutation({
    mutationFn: (newProduct: Omit<CreateProductRequest, "storeId">) =>
      productApiService.createProduct({
        ...newProduct,
        storeId: storeId as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
      });
    },
  });

  // UPDATE
  const updateProductMutation = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => productApiService.updateProduct(productId, data),
    onMutate: async ({ productId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["products", storeId] });
      const previous = queryClient.getQueryData(["products", storeId]);

      // raw cached response shape: { data: { data: IMenu[] } }
      queryClient.setQueryData(["products", storeId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const response = old as {
          data?: { data?: IMenu[] | unknown };
        };
        const list = response.data?.data;
        if (!Array.isArray(list)) return old;

        const nextList = (list as IMenu[]).map((p) =>
          p.id === productId ? { ...p, ...data } : p
        );
        return {
          ...response,
          data: { ...response.data, data: nextList },
        };
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["products", storeId], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
      });
    },
  });

  // DELETE
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => productApiService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", storeId],
      });
    },
  });

  return {
    productsQuery: productsListQuery.data ?? [],
    productsQueryLoading: productsListQuery.isLoading,
    productsByCategoryQuery: productsByCategoryQuery.data ?? [],
    productsByCategoryLoading: productsByCategoryQuery.isLoading,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
}
