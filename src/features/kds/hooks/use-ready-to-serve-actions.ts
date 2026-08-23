import { useState } from "react";
import { orderApiService } from "@/features/order/services/order";
import { appBus } from "@/shared/events/app-events";
import { useAppSelector } from "@/shared/hooks/hooks";
import { toast } from "@/shared/services/toast-service";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { ReadyToServeItem } from "@/features/kds/hooks/use-ready-to-serve";

export const useReadyToServeActions = (onServed?: (itemId: string) => void) => {
  const { t } = useTranslation();
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;
  const [servingIds, setServingIds] = useState<Set<string>>(new Set());

  const markServed = async (item: ReadyToServeItem) => {
    setServingIds((prev) => new Set(prev).add(item.id));

    try {
      await orderApiService.updateOrderStationItem(item.id, {
        status: "served",
        stationId: item.stationId,
        orderItemId: item.orderItemId,
      });

      appBus.emit("order:statusChanged", {
        orderStationItemId: item.id,
        from: "READY",
        to: "SERVED",
        stationId: item.stationId,
      });
      appBus.emit("order:updated", {
        orderId: item.orderId,
        storeId,
      });
      appBus.emit("transaction:updated", {
        transactionId: item.orderId,
        storeId,
      });

      onServed?.(item.id);
      toast.success({
        title: t("serve.feedback.servedTitle"),
        description: t("serve.feedback.servedDescription", {
          product: item.productName,
        }),
        durationMs: 2200,
      });
    } catch {
      toast.error({
        title: t("serve.feedback.errorTitle"),
        description: t("serve.feedback.errorDescription"),
      });
    } finally {
      setServingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  return { servingIds, markServed };
};
