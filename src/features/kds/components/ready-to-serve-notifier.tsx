import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBellRing, LuCheck, LuChefHat, LuExternalLink, LuX } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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
    readReadyToServeDismissed(storeId)
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastItem, setToastItem] = useState<ReadyToServeItem | null>(null);
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
    if (newest) setToastItem(newest);
    previousIdsRef.current = visibleIds;
  }, [visibleItems]);

  useEffect(() => {
    return appBus.on("ui:readyToServeRequested", () => {
      setDrawerOpen(true);
      setToastItem(null);
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
    if (toastItem?.id === id) setToastItem(null);
  };

  const openKds = () => {
    if (storeId) navigate(`/store/${storeId}/kds`);
    setDrawerOpen(false);
    setToastItem(null);
  };

  return (
    <>
      {toastItem && (
        <div className="fixed inset-x-4 bottom-4 z-[70] sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:w-[360px]">
          <div className="rounded-card border border-warning/30 bg-surface p-4 shadow-xl ring-1 ring-warning/10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning">
                <LuBellRing size={20} />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-title font-[var(--weight-semibold)] text-text-primary">
                  {t("serve.toast.title", { context: getItemContext(toastItem) })}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {t("serve.toast.body", {
                    product: toastItem.productName,
                    quantity: String(toastItem.quantity),
                  })}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => setDrawerOpen(true)}>
                    {t("serve.action.view")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setToastItem(null)}>
                    {t("common.close")}
                  </Button>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("common.close")}
                onClick={() => setToastItem(null)}
                className="rounded-full p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <LuX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-warning-bg text-warning">
                    <LuChefHat size={20} />
                  </span>
                  <h2 className="text-heading text-text-primary">{t("serve.drawer.title")}</h2>
                </div>
                <p className="text-body-sm text-text-secondary">
                  {t("serve.drawer.subtitle", { count: String(visibleItems.length) })}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("common.close")}
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <LuX size={20} />
              </button>
            </div>

            {visibleItems.length === 0 ? (
              <div className="rounded-card border border-card-border bg-card-bg p-card-padding text-center">
                <p className="text-title text-text-primary">{t("serve.empty.title")}</p>
                <p className="mt-1 text-body-sm text-text-secondary">{t("serve.empty.body")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-card border border-card-border bg-card-bg p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-title text-text-primary">{getItemContext(item)}</p>
                        <p className="text-body-sm text-text-secondary">
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
                    <div className="rounded-lg bg-surface px-3 py-2">
                      <p className="text-body text-text-primary">
                        {item.productName} x{item.quantity}
                      </p>
                      {item.note && (
                        <p className="mt-1 text-caption text-text-secondary">{item.note}</p>
                      )}
                    </div>
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
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
