import axiosClient from "@/shared/services/axios-client";
import type {
  ApiResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/features/product/types/product.dto";
import type { IMenu } from "@/features/product/types/product.model";

export const productApiService = {
  getProductsByStoreId: async (storeId: string) => {
    return await axiosClient.get<ApiResponse<IMenu[]>>(`/products/store/${storeId}`);
  },

  getProductById: async (productId: string) => {
    return await axiosClient.get<ApiResponse<IMenu | string>>(`/products/${productId}`);
  },

  getProductsByCategoryId: async (categoryId: string) => {
    return await axiosClient.get<ApiResponse<IMenu[]>>(`/products/category/${categoryId}`);
  },

  createProduct: async (data: CreateProductRequest) => {
    return await axiosClient.post<ApiResponse<IMenu>>("/products", data);
  },

  updateProduct: async (productId: string, data: UpdateProductRequest) => {
    return await axiosClient.patch<ApiResponse<IMenu>>(`/products/${productId}`, data);
  },

  deleteProduct: async (productId: string) => {
    return await axiosClient.delete<ApiResponse<{ message: string }>>(`/products/${productId}`);
  },
};
