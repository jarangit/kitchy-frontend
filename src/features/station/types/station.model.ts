export interface IStation {
  id: number;
  name: string;
  color?: string;
  restaurantId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StationFormData {
  name: string;
  color?: string;
}
