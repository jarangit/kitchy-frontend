export interface ICategoryDto {
  id?: string;
  name?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequestDto {
  name: string;
  storeId: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryRequestDto {
  name?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}
