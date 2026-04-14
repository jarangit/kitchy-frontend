export interface IMenu {
  id: string;
  name: string;
  isActive: boolean;
  price?: number;
  categoryId?: string;
  categoryName?: string;
  stationId?: string;
  stationName?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
  store?: unknown;
  station?: unknown;
  category?: unknown | null;
}

export interface ProductFormData {
  name: string;
  stationId: string;
  categoryId?: string;
}

export interface MenuFormData {
  name: string;
}
