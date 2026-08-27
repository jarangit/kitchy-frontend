import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuChefHat, LuExternalLink, LuX } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { IconButton } from "@/shared/components/ui/icon-button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { ReadyToServeList } from "@/features/kds/components/ready-to-serve-list";
import { useReadyToServeActions } from "@/features/kds/hooks/use-ready-to-serve-actions";
import {
  readReadyToServeDismissed,
  writeReadyToServeDismissed,
} from "@/features/kds/utils/ready-to-serve-dismissed";

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

  const dismissItem = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      writeReadyToServeDismissed(storeId, next);
      appBus.emit("ui:readyToServeDismissed", { itemId: id });
      return next;
    });
  };
  const { servingIds, markServed } = useReadyToServeActions(dismissItem);

  const openKds = () => {
    if (storeId) navigate(`/store/${storeId}/kds`);
    setDrawerOpen(false);
  };

  const openReadyToServePage = () => {
    if (storeId) navigate(`/store/${storeId}/ready-to-serve`);
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
              <div className="space-y-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-full justify-center text-button-sm"
                  onClick={openReadyToServePage}
                >
                  <LuExternalLink size={15} />
                  {t("serve.action.openPage")}
                </Button>
                <ReadyToServeList
                  items={visibleItems}
                  servingIds={servingIds}
                  onServed={(item) => void markServed(item)}
                  onOpenKds={openKds}
                />
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
