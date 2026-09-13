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

export interface IUpdateStorePinPayload {
  currentPin: string;
  newPin: string;
}

export type StorePinErrorCode =
  | "STORE_PIN_REQUIRED"
  | "STORE_PIN_NOT_SET"
  | "STORE_PIN_MUST_BE_DIFFERENT"
  | "INVALID_STORE_PIN"
  | "STORE_PIN_ALREADY_SET"
  | "STORE_NOT_FOUND"
  | "FIND_STORE_FAILED";
