import axiosClient from "@/shared/services/axios-client";
import type {
  ApiResponseDto,
  CreateCategoryRequestDto,
  ICategoryDto,
  UpdateCategoryRequestDto,
} from "@/features/category/types/category.dto";

export const categoryServiceApi = {
  getByStoreId: async (storeId: string) => {
    return await axiosClient.get<ApiResponseDto<ICategoryDto[]>>(
      `/category/store/${storeId}`,
    );
  },
  create: async (data: CreateCategoryRequestDto) => {
    return await axiosClient.post<ApiResponseDto<ICategoryDto>>(
      "/category",
      data,
    );
  },
  update: async (id: string, data: UpdateCategoryRequestDto) => {
    return await axiosClient.patch<ApiResponseDto<ICategoryDto>>(
      `/category/${id}`,
      data,
    );
  },
  delete: async (id: string) => {
    return await axiosClient.delete<ApiResponseDto<null>>(`/category/${id}`);
  },
};
