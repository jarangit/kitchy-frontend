export interface IMenu {
  id: number;
  name: string;
  price: number;
  stationId?: number;
  stationName?: string;
  storeId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProductFormData {
  name: string;
  price?: number;
  stationId?: string;
}

export interface MenuFormData {
  name: string;
}
