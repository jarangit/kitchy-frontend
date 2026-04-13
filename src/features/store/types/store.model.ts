export interface IRestaurant {
  id: number;
  name: string;
  userId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RestaurantFormData {
  name: string;
}
