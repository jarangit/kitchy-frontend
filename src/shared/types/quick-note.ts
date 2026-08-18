export interface QuickNote {
  id: string;
  storeId?: string;
  text: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuickNoteRequest {
  storeId: string;
  text: string;
  sortOrder?: number;
}

export interface UpdateQuickNoteRequest {
  text?: string;
  sortOrder?: number;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}
