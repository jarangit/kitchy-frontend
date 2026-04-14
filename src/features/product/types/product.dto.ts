export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateProductRequest {
  name: string;
  storeId: string;
  stationId: string;
  categoryId?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;
