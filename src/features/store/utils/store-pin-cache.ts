const pinCache = new Map<string, string>();

export function isValidStorePin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

export function getStorePin(storeId: string): string | undefined {
  return pinCache.get(storeId);
}

export function setStorePinCache(storeId: string, pin: string): void {
  if (!isValidStorePin(pin)) return;
  pinCache.set(storeId, pin);
}

export function clearStorePinCache(storeId: string): void {
  pinCache.delete(storeId);
}

export function hasStorePin(storeId: string): boolean {
  const pin = pinCache.get(storeId);
  return pin !== undefined && isValidStorePin(pin);
}
