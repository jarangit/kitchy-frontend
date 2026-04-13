export interface IStation {
  id: string;
  name: string;
  color?: string;
  storeId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StationFormData {
  name: string;
  color?: string;
}
