import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCheck, LuChefHat, LuExternalLink, LuX } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { IconButton } from "@/shared/components/ui/icon-button";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
import {
  useReadyToServeItems,
  type ReadyToServeItem,
} from "@/features/kds/hooks/use-ready-to-serve";
import {
  readReadyToServeDismissed,
  writeReadyToServeDismissed,
} from "@/features/kds/utils/ready-to-serve-dismissed";
import { toast } from "@/shared/services/toast-service";

const getItemContext = (item: ReadyToServeItem) => {
  if (item.orderType === "DINE_IN" && item.tableNumber) {
    return `Table ${item.tableNumber}`;
  }
  if (item.orderType === "DELIVERY") {
    return item.deliveryPlatform ?? "Delivery";
  }
  return `#${item.orderNumber}`;
};

const getWaitingMinutes = (createdAt: string) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

export function ReadyToServeNotifier() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const { items } = useReadyToServeItems();
  const [dismissed, setDismissed] = useState<Set<string>>(() =>
    readReadyToServeDismissed(storeId)
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const previousIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
    previousIdsRef.current = null;
  }, [storeId]);

  const visibleItems = useMemo(
    () => items.filter((item) => !dismissed.has(item.id)),
    [items, dismissed]
  );

  useEffect(() => {
    const visibleIds = new Set(visibleItems.map((item) => item.id));
    if (previousIdsRef.current == null) {
      previousIdsRef.current = visibleIds;
      return;
    }

    const newest = visibleItems.find((item) => !previousIdsRef.current?.has(item.id));
    if (newest) {
      toast.success({
        title: t("serve.toast.title", { context: getItemContext(newest) }),
        description: t("serve.toast.body", {
          product: newest.productName,
          quantity: String(newest.quantity),
        }),
        action: {
          label: t("serve.action.view"),
          onClick: () => setDrawerOpen(true),
        },
      });
    }
    previousIdsRef.current = visibleIds;
  }, [t, visibleItems]);

  useEffect(() => {
    return appBus.on("ui:readyToServeRequested", () => {
      setDrawerOpen(true);
      toast.dismiss();
    });
  }, []);

  const acknowledge = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      writeReadyToServeDismissed(storeId, next);
      appBus.emit("ui:readyToServeDismissed", { itemId: id });
      return next;
    });
  };

  const openKds = () => {
    if (storeId) navigate(`/store/${storeId}/kds`);
    setDrawerOpen(false);
  };

  return (
    <>
      {drawerOpen && (
        <div className="fixed inset-0 z-[65]">
          <button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 bg-dialog-overlay"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] border border-border bg-bg p-5 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-[420px] sm:rounded-none sm:border-y-0 sm:border-r-0 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-warning-bg text-warning">
                    <LuChefHat size={20} />
                  </span>
                  <h2 className="text-heading text-text-primary">{t("serve.drawer.title")}</h2>
                </div>
                <p className="text-body text-text-secondary">
                  {t("serve.drawer.subtitle", { count: String(visibleItems.length) })}
                </p>
              </div>
              <IconButton
                aria-label={t("common.close")}
                onClick={() => setDrawerOpen(false)}
              >
                <LuX size={20} />
              </IconButton>
            </div>

            {visibleItems.length === 0 ? (
              <Card className="text-center">
                <p className="text-title text-text-primary">{t("serve.empty.title")}</p>
                <p className="mt-1 text-body text-text-secondary">{t("serve.empty.body")}</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {visibleItems.map((item) => (
                  <Card
                    as="article"
                    key={item.id}
                    padding="sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-title text-text-primary">{getItemContext(item)}</p>
                        <p className="text-body text-text-secondary">
                          {t("serve.item.meta", {
                            order: item.orderNumber,
                            station: item.stationName,
                          })}
                        </p>
                      </div>
                      <Badge variant="warning">
                        {t("serve.item.waiting", {
                          minutes: String(getWaitingMinutes(item.createdAt)),
                        })}
                      </Badge>
                    </div>
                    <InsetPanel className="rounded-lg px-3 py-2">
                      <p className="text-body text-text-primary">
                        {item.productName} x{item.quantity}
                      </p>
                      {item.note && (
                        <p className="mt-1 text-body-sm text-text-secondary">{item.note}</p>
                      )}
                    </InsetPanel>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={() => acknowledge(item.id)}>
                        <LuCheck size={16} />
                        {t("serve.action.acknowledge")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={openKds}>
                        <LuExternalLink size={16} />
                        {t("serve.action.openKds")}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
