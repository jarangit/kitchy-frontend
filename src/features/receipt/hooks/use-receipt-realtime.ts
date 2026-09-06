import { useEffect } from "react";
import {
  getRealtimeClient,
  refreshRealtimeAuth,
} from "@/shared/realtime/realtime-client";
import type {
  ReceiptExpiredPayload,
  ReceiptUpdatedPayload,
} from "@/features/receipt/types/receipt.dto";

export const useReceiptRealtime = ({
  receiptToken,
  onUpdated,
  onExpired,
}: {
  receiptToken?: string;
  onUpdated: (payload: ReceiptUpdatedPayload) => void;
  onExpired: (payload: ReceiptExpiredPayload) => void;
}) => {
  useEffect(() => {
    if (!receiptToken) return;

    const client = refreshRealtimeAuth();

    const join = () => client.emit("receipt.join", { receiptToken });
    const handleUpdated = (payload: ReceiptUpdatedPayload) => {
      if (payload.receiptToken === receiptToken) onUpdated(payload);
    };
    const handleExpired = (payload: ReceiptExpiredPayload) => {
      if (payload.receiptToken === receiptToken) onExpired(payload);
    };

    client.on("receipt.updated", handleUpdated);
    client.on("receipt.expired", handleExpired);
    client.on("connect", join);

    if (!client.connected) {
      client.connect();
    } else {
      join();
    }

    return () => {
      const currentClient = getRealtimeClient();
      currentClient.emit("receipt.leave", { receiptToken });
      currentClient.off("receipt.updated", handleUpdated);
      currentClient.off("receipt.expired", handleExpired);
      currentClient.off("connect", join);
    };
  }, [onExpired, onUpdated, receiptToken]);
};
