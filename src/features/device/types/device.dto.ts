export type DeviceStatus = "UNPAIRED" | "PENDING" | "PAIRED" | "DISABLED";

export interface DeviceStation {
  id: string;
  name: string;
}

export interface DeviceDto {
  id: string;
  deviceId: string;
  storeId?: string | null;
  stationId?: string | null;
  alias?: string | null;
  deviceName?: string | null;
  fingerprint?: string | null;
  appVersion?: string | null;
  status: DeviceStatus;
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt: string;
  station?: DeviceStation | null;
  store?: { id: string } | null;
}

export interface UpdateDeviceRequest {
  alias?: string;
  deviceName?: string;
  status?: DeviceStatus;
  stationId?: string;
}

export interface PairingCodeResponse {
  id: string;
  code: string;
  storeId: string;
  stationId?: string | null;
  expiresAt?: string | null;
  reused?: boolean;
}

export interface JoinPairingResponse {
  access_token: string;
  storeId?: string | null;
  stationId?: string | null;
}
