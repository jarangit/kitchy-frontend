import type { StoreSettings } from "@/features/store/types/store.model";

export interface ICreateStore {
  userId?: string;
  name: string;
}

export interface IUpdateStore {
  pin: string;
  name?: string;
  orderLimit?: number;
  settings?: StoreSettings | null;
}

export interface ISetStorePinPayload {
  pin: string;
}

export type StorePinErrorCode =
  | "STORE_PIN_REQUIRED"
  | "INVALID_STORE_PIN"
  | "STORE_PIN_ALREADY_SET"
  | "STORE_NOT_FOUND"
  | "FIND_STORE_FAILED";
