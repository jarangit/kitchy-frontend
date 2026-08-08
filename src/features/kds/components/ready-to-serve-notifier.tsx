import { useEffect, useMemo, useState } from "react";
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
    readReadyToServeDismissed(storeId),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
  }, [storeId]);

  const visibleItems = useMemo(
    () => items.filter((item) => !dismissed.has(item.id)),
    [items, dismissed],
  );

  useEffect(() => {
    return appBus.on("ui:readyToServeRequested", () => {
      setDrawerOpen(true);
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
          <aside className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] border border-border bg-bg p-4 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-[400px] sm:rounded-none sm:border-y-0 sm:border-r-0 sm:p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-warning-bg text-warning">
                    <LuChefHat size={16} />
                  </span>
                  <h2 className="text-subtitle text-text-primary">
                    {t("serve.drawer.title")}
                  </h2>
                </div>
                <p className="text-body-sm text-text-secondary">
                  {t("serve.drawer.subtitle", {
                    count: String(visibleItems.length),
                  })}
                </p>
              </div>
              <IconButton
                aria-label={t("common.close")}
                onClick={() => setDrawerOpen(false)}
              >
                <LuX size={18} />
              </IconButton>
            </div>

            {visibleItems.length === 0 ? (
              <Card className="text-center">
                <p className="text-title text-text-primary">
                  {t("serve.empty.title")}
                </p>
                <p className="mt-1 text-body-sm text-text-secondary">
                  {t("serve.empty.body")}
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {visibleItems.map((item) => (
                  <Card
                    as="article"
                    key={item.id}
                    padding="none"
                    className="px-3 py-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-body font-medium text-text-primary">
                          {getItemContext(item)}
                        </p>
                        <p className="truncate text-body-sm text-text-secondary">
                          {t("serve.item.meta", {
                            order: item.orderNumber,
                            station: item.stationName,
                          })}
                        </p>
                      </div>
                      <Badge variant="warning" className="shrink-0">
                        {t("serve.item.waiting", {
                          minutes: String(getWaitingMinutes(item.createdAt)),
                        })}
                      </Badge>
                    </div>
                    <InsetPanel className="rounded-md px-3 py-1.5">
                      <p className="text-body-sm text-text-primary">
                        {item.productName} x{item.quantity}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 truncate text-body-sm text-text-secondary">
                          {item.note}
                        </p>
                      )}
                    </InsetPanel>
                    <div className="mt-2.5 flex gap-2">
                      <Button
                        size="sm"
                        className="h-9 px-3 text-button-sm"
                        onClick={() => acknowledge(item.id)}
                      >
                        <LuCheck size={15} />
                        {t("serve.action.acknowledge")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 px-3 text-button-sm"
                        onClick={openKds}
                      >
                        <LuExternalLink size={15} />
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
