import type { DeviceDto, DeviceStatus } from "./device.dto";

export interface DeviceModel {
  id: string;
  name: string;
  status: DeviceStatus;
  online: boolean;
  stationName?: string | null;
}

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export function isDeviceOnline(device: DeviceDto, now = Date.now()): boolean {
  if (!device.lastSeenAt) return false;
  const lastSeen = new Date(device.lastSeenAt).getTime();
  return now - lastSeen <= ONLINE_WINDOW_MS;
}

export function toDeviceModel(device: DeviceDto): DeviceModel {
  return {
    id: device.id,
    name: device.alias || device.deviceName || device.deviceId,
    status: device.status,
    online: isDeviceOnline(device),
    stationName: device.station?.name ?? null,
  };
}
