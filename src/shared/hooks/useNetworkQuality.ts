import { useEffect, useMemo, useState } from "react";

type ConnectionLike = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionLike;
};

export type NetworkQualityLevel = "poor" | "fair" | "good";

const getLevel = (isOnline: boolean, connection?: ConnectionLike): NetworkQualityLevel => {
  if (!isOnline) return "poor";
  if (!connection) return "fair";

  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink ?? 0;
  const rtt = connection.rtt ?? 0;

  if (effectiveType === "slow-2g" || effectiveType === "2g") return "poor";
  if (effectiveType === "3g") return "fair";

  if (effectiveType === "4g") {
    if (downlink >= 5 && (rtt === 0 || rtt <= 120)) return "good";
    if (downlink >= 1.5 && (rtt === 0 || rtt <= 320)) return "fair";
    return "poor";
  }

  if (downlink >= 5 && (rtt === 0 || rtt <= 120)) return "good";
  if (downlink >= 1.5 && (rtt === 0 || rtt <= 320)) return "fair";
  return "poor";
};

export const useNetworkQuality = () => {
  const initialOnline = typeof navigator === "undefined" ? true : navigator.onLine;
  const [isOnline, setIsOnline] = useState(initialOnline);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection;

    const onOnline = () => {
      setIsOnline(true);
      setTick((v) => v + 1);
    };
    const onOffline = () => {
      setIsOnline(false);
      setTick((v) => v + 1);
    };
    const onConnectionChange = () => setTick((v) => v + 1);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    connection?.addEventListener?.("change", onConnectionChange);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      connection?.removeEventListener?.("change", onConnectionChange);
    };
  }, []);

  const level = useMemo(() => {
    void tick;
    const nav = navigator as NavigatorWithConnection;
    return getLevel(isOnline, nav.connection);
  }, [isOnline, tick]);

  return { isOnline, level };
};
