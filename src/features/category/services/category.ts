import axiosClient from "@/shared/services/axios-client";
import type {
  ApiResponseDto,
  CreateCategoryRequestDto,
  ICategoryDto,
  UpdateCategoryRequestDto,
} from "@/features/category/types/category.dto";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

export const categoryServiceApi = {
  getByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getCategoriesByStoreId(storeId);
      return { data: { success: true, message: "ok", data } } as { data: ApiResponseDto<ICategoryDto[]> };
    }
    return await axiosClient.get<ApiResponseDto<ICategoryDto[]>>(
      `/category/store/${storeId}`,
    );
  },
  create: async (data: CreateCategoryRequestDto) => {
    if (IS_DEMO_MODE) {
      const cat = await (await getAdapter()).createCategory(data);
      return { data: { success: true, message: "ok", data: cat } } as { data: ApiResponseDto<ICategoryDto> };
    }
    return await axiosClient.post<ApiResponseDto<ICategoryDto>>(
      "/category",
      data,
    );
  },
  update: async (id: string, data: UpdateCategoryRequestDto) => {
    if (IS_DEMO_MODE) {
      const cat = await (await getAdapter()).updateCategory(id, data);
      return { data: { success: true, message: "ok", data: cat } } as { data: ApiResponseDto<ICategoryDto> };
    }
    return await axiosClient.patch<ApiResponseDto<ICategoryDto>>(
      `/category/${id}`,
      data,
    );
  },
  delete: async (id: string) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).deleteCategory(id);
      return { data: { success: true, message: "ok", data: null } } as { data: ApiResponseDto<null> };
    }
    return await axiosClient.delete<ApiResponseDto<null>>(`/category/${id}`);
  },
};
