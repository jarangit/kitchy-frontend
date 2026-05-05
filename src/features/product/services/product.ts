import axiosClient from "@/shared/services/axios-client";
import type {
  ApiResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/features/product/types/product.dto";
import type { IMenu } from "@/features/product/types/product.model";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

export const productApiService = {
  getProductsByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getProductsByStoreId(storeId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<IMenu[]> };
    }
    return await axiosClient.get<ApiResponse<IMenu[]>>(`/products/store/${storeId}`);
  },

  getProductById: async (productId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getProductById(productId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<IMenu | string> };
    }
    return await axiosClient.get<ApiResponse<IMenu | string>>(`/products/${productId}`);
  },

  getProductsByCategoryId: async (categoryId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getProductsByCategoryId(categoryId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponse<IMenu[]> };
    }
    return await axiosClient.get<ApiResponse<IMenu[]>>(`/products/category/${categoryId}`);
  },

  createProduct: async (data: CreateProductRequest) => {
    if (IS_DEMO_MODE) {
      const product = await (await getAdapter()).createProduct(data);
      return { data: { success: true, message: "ok", data: product } } as { data: ApiResponse<IMenu> };
    }
    return await axiosClient.post<ApiResponse<IMenu>>("/products", data);
  },

  updateProduct: async (productId: string, data: UpdateProductRequest) => {
    if (IS_DEMO_MODE) {
      const product = await (await getAdapter()).updateProduct(productId, data);
      return { data: { success: true, message: "ok", data: product } } as { data: ApiResponse<IMenu> };
    }
    return await axiosClient.patch<ApiResponse<IMenu>>(`/products/${productId}`, data);
  },

  deleteProduct: async (productId: string) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).deleteProduct(productId);
      return { data: { success: true, message: "ok", data: { message: "deleted" } } } as { data: ApiResponse<{ message: string }> };
    }
    return await axiosClient.delete<ApiResponse<{ message: string }>>(`/products/${productId}`);
  },
};
