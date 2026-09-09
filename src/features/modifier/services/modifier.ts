import axiosClient from "@/shared/services/axios-client";
import type {
  AdminModifierGroupResponse,
  AdminModifierOptionResponse,
  ApiResponse,
  AssignModifierGroupRequest,
  CreateModifierGroupRequest,
  CreateModifierOptionRequest,
  ProductModifierAssignmentResponse,
  UpdateModifierGroupRequest,
  UpdateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";

export const modifierApiService = {
  listGroups: async (storeId: string) => {
    return await axiosClient.get<ApiResponse<AdminModifierGroupResponse[]>>(
      "/modifier-groups",
      { params: { storeId } },
    );
  },

  getGroup: async (groupId: string) => {
    return await axiosClient.get<ApiResponse<AdminModifierGroupResponse>>(
      `/modifier-groups/${groupId}`,
    );
  },

  createGroup: async (data: CreateModifierGroupRequest) => {
    return await axiosClient.post<ApiResponse<AdminModifierGroupResponse>>(
      "/modifier-groups",
      data,
    );
  },

  updateGroup: async (groupId: string, data: UpdateModifierGroupRequest) => {
    return await axiosClient.patch<ApiResponse<AdminModifierGroupResponse>>(
      `/modifier-groups/${groupId}`,
      data,
    );
  },

  deleteGroup: async (groupId: string) => {
    return await axiosClient.delete<ApiResponse<{ message: string }>>(
      `/modifier-groups/${groupId}`,
    );
  },

  createOption: async (groupId: string, data: CreateModifierOptionRequest) => {
    return await axiosClient.post<ApiResponse<AdminModifierOptionResponse>>(
      `/modifier-groups/${groupId}/options`,
      data,
    );
  },

  updateOption: async (optionId: string, data: UpdateModifierOptionRequest) => {
    return await axiosClient.patch<ApiResponse<AdminModifierOptionResponse>>(
      `/modifier-options/${optionId}`,
      data,
    );
  },

  deleteOption: async (optionId: string) => {
    return await axiosClient.delete<ApiResponse<{ message: string }>>(
      `/modifier-options/${optionId}`,
    );
  },

  assignGroupToProduct: async (
    productId: string,
    data: AssignModifierGroupRequest,
  ) => {
    return await axiosClient.post<
      ApiResponse<ProductModifierAssignmentResponse>
    >(`/products/${productId}/modifier-groups`, data);
  },

  removeGroupFromProduct: async (
    productId: string,
    modifierGroupId: string,
  ) => {
    return await axiosClient.delete<ApiResponse<{ message: string }>>(
      `/products/${productId}/modifier-groups/${modifierGroupId}`,
    );
  },
};
