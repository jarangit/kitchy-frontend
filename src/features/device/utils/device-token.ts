export const DEVICE_TOKEN_KEY = "device_token";

export interface DeviceTokenPayload {
  sub?: string;
  store?: string | null;
  station?: string | null;
  tokenType?: string;
  [key: string]: unknown;
}

export const hasDeviceToken = (): boolean =>
  Boolean(localStorage.getItem(DEVICE_TOKEN_KEY));

export const getDeviceToken = (): string | null =>
  localStorage.getItem(DEVICE_TOKEN_KEY);

export const saveDeviceToken = (token: string): void =>
  localStorage.setItem(DEVICE_TOKEN_KEY, token);

export const clearDeviceToken = (): void =>
  localStorage.removeItem(DEVICE_TOKEN_KEY);

const decodeBase64Url = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const raw = atob(padded);
  const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeDeviceToken = (
  token: string | null = getDeviceToken(),
): DeviceTokenPayload | null => {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    return JSON.parse(decodeBase64Url(part)) as DeviceTokenPayload;
  } catch {
    return null;
  }
};
