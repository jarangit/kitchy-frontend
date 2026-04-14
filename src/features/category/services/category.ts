import axiosClient from "@/shared/services/axios-client";
import type {
  ApiResponseDto,
  CreateCategoryRequestDto,
  ICategoryDto,
} from "@/features/category/types/category.dto";

export const categoryServiceApi = {
  getByStoreId: async (storeId: string) => {
    return await axiosClient.get<ApiResponseDto<ICategoryDto[]>>(
      `/category/store/${storeId}`
    );
  },
  create: async (data: CreateCategoryRequestDto) => {
    return await axiosClient.post<ApiResponseDto<ICategoryDto>>("/category", data);
  },
};
