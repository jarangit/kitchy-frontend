export interface IMenu {
  id: string;
  name: string;
  price: number;
  stationId?: string;
  stationName?: string;
  storeId: string;
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
