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
  price: number;
  cost?: number;
  isActive: boolean;
  imageUrl?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;
