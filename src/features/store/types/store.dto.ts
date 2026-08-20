import type { StoreSettings } from "@/features/store/types/store.model";

export interface ICreateStore {
  userId: string;
  name: string;
}

export interface IUpdateStore {
  name?: string;
  orderLimit?: number;
  settings?: StoreSettings | null;
}
