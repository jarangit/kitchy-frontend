export interface IStore {
  id: number;
  name: string;
  userId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StoreFormData {
  name: string;
}
