export interface IStore {
  id: string;
  name: string;
  orderLimit?: number;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StoreFormData {
  name: string;
}
