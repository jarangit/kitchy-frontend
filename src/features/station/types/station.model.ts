export interface IStation {
  id: number;
  name: string;
  color?: string;
  storeId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StationFormData {
  name: string;
  color?: string;
}
