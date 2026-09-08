import type { ModifierSelectionType } from "@/shared/types/modifier";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminModifierOptionResponse {
  id: string;
  modifierGroupId: string | null;
  name: string;
  priceAdjustment: number;
  sortOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminModifierGroupResponse {
  id: string;
  storeId: string | null;
  name: string;
  selectionType: ModifierSelectionType;
  minSelect: number;
  maxSelect: number;
  isActive: boolean;
  options: AdminModifierOptionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateModifierGroupRequest {
  storeId: string;
  name: string;
  selectionType: ModifierSelectionType;
  minSelect?: number;
  maxSelect?: number;
}

export type UpdateModifierGroupRequest = Partial<
  Omit<CreateModifierGroupRequest, "storeId">
> & { storeId?: string };

export interface CreateModifierOptionRequest {
  name: string;
  priceAdjustment?: number;
  sortOrder?: number;
  isAvailable?: boolean;
}

export type UpdateModifierOptionRequest = Partial<CreateModifierOptionRequest>;

export interface AssignModifierGroupRequest {
  modifierGroupId: string;
  sortOrder?: number;
}

export interface ProductModifierAssignmentResponse {
  id: string;
  productId: string;
  modifierGroupId: string;
  sortOrder: number;
}
