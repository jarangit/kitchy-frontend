export interface IMenu {
  id: number;
  name: string;
  stationId?: number;
  storeId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProductFormData {
  name: string;
  stationId?: string;
}

export interface MenuFormData {
  name: string;
}
