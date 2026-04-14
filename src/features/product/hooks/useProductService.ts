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
    onSuccess: () => {
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
