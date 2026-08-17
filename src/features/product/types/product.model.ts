export interface IMenu {
  id: string;
  name: string;
  isActive: boolean;
  isBestSeller?: boolean;
  price?: number;
  cost?: number;
  imageUrl?: string | null;
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
  price: number;
  cost?: number;
  isActive: boolean;
  isBestSeller?: boolean;
  imageUrl?: string | null;
}

export interface MenuFormData {
  name: string;
}
