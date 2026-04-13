export interface IStore {
  id: string;
  name: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StoreFormData {
  name: string;
}
