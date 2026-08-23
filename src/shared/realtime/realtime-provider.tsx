import { useEffect, useRef, useSyncExternalStore } from "react";
import { appBus } from "@/shared/events/app-events";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useTranslation } from "@/shared/i18n/use-translation";
import { toast } from "@/shared/services/toast-service";
import {
  getRealtimeConnectionState,
  getRealtimeClient,
  refreshRealtimeAuth,
  subscribeRealtimeConnection,
} from "@/shared/realtime/realtime-client";
import type { KdsStatus } from "@/features/kds/types/kds.model";

type OrderCreatedPayload = {
  orderId: string;
  storeId: string;
  stationIds: string[];
};

type OrderUpdatedPayload = {
  orderId: string;
  storeId: string;
};

type OrderStationItemUpdatedPayload = {
  orderStationItemId: string;
  stationId: string;
  status: "pending" | "complete" | "served";
};

const toKdsStatus = (
  status: OrderStationItemUpdatedPayload["status"],
): KdsStatus => {
  if (status === "served") return "SERVED";
  return status === "complete" ? "READY" : "PENDING";
};

export function RealtimeProvider() {
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const stationId = useAppSelector((state) => state.currentStation.stationId);
  const hasConnectedRef = useRef(false);
  const disconnectToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const client = refreshRealtimeAuth();

    const handleOrderCreated = (payload: OrderCreatedPayload) => {
      appBus.emit("order:created", {
        orderId: payload.orderId,
        storeId: payload.storeId,
      });
    };

    const handleOrderUpdated = (payload: OrderUpdatedPayload) => {
      appBus.emit("order:updated", {
        orderId: payload.orderId,
        storeId: payload.storeId,
      });
    };

    const handleOrderStationItemUpdated = (
      payload: OrderStationItemUpdatedPayload,
    ) => {
      const status = toKdsStatus(payload.status);
      appBus.emit("order:statusChanged", {
        orderStationItemId: payload.orderStationItemId,
        from: status,
        to: status,
        stationId: payload.stationId,
      });
    };

    const joinCurrentRooms = () => {
      if (storeId) {
        client.emit("join-room", { storeId });
      }

      if (stationId) {
        client.emit("join-room", { stationId });
      }
    };

    const handleConnect = () => {
      joinCurrentRooms();

      if (disconnectToastIdRef.current) {
        toast.dismiss(disconnectToastIdRef.current);
        disconnectToastIdRef.current = null;
      }

      if (hasConnectedRef.current) {
        toast.success({
          title: t("kds.realtime.reconnectedTitle"),
          description: t("kds.realtime.reconnectedDescription"),
          durationMs: 2500,
        });
      }

      hasConnectedRef.current = true;
    };

    const handleDisconnect = () => {
      if (!hasConnectedRef.current) return;
      if (disconnectToastIdRef.current) return;
      if (!storeId && !stationId) return;

      disconnectToastIdRef.current = toast.warning({
        title: t("kds.realtime.disconnectedTitle"),
        description: t("kds.realtime.disconnectedDescription"),
        durationMs: 0,
      });
    };

    client.on("order.created", handleOrderCreated);
    client.on("order.updated", handleOrderUpdated);
    client.on("order.station-item.updated", handleOrderStationItemUpdated);
    client.on("connect", handleConnect);
    client.on("disconnect", handleDisconnect);

    if (!client.connected) {
      client.connect();
    }

    return () => {
      client.off("order.created", handleOrderCreated);
      client.off("order.updated", handleOrderUpdated);
      client.off("order.station-item.updated", handleOrderStationItemUpdated);
      client.off("connect", handleConnect);
      client.off("disconnect", handleDisconnect);
    };
  }, [stationId, storeId, t]);

  useEffect(() => {
    const client = getRealtimeClient();
    if (!storeId) return;

    client.emit("join-room", { storeId });

    return () => {
      client.emit("leave-room", { storeId });
    };
  }, [storeId]);

  useEffect(() => {
    const client = getRealtimeClient();
    if (!stationId) return;

    client.emit("join-room", { stationId });

    return () => {
      client.emit("leave-room", { stationId });
    };
  }, [stationId]);

  useEffect(() => {
    const unsubscribeLogin = appBus.on("auth:login", () => {
      const client = refreshRealtimeAuth();
      if (client.connected) {
        client.disconnect();
      }
      client.connect();
    });

    const unsubscribeLogout = appBus.on("auth:logout", () => {
      const client = getRealtimeClient();
      client.disconnect();
    });

    const unsubscribeUnauthorized = appBus.on("auth:unauthorized", () => {
      const client = getRealtimeClient();
      client.disconnect();
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeUnauthorized();
    };
  }, []);

  return null;
}

export const useRealtimeConnected = () => {
  return useSyncExternalStore(
    subscribeRealtimeConnection,
    getRealtimeConnectionState,
    () => false,
  );
};
