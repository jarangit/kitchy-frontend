import "./app-bar-notch.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuBellRing, LuChefHat, LuExternalLink, LuX } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { usePendingOrdersCount } from "@/features/kds/hooks/use-pending-orders-count";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { readReadyToServeDismissed } from "@/features/kds/utils/ready-to-serve-dismissed";

const getItemContext = (item: {
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
  tableNumber?: string;
  deliveryPlatform?: string;
  orderNumber: string;
}) => {
  if (item.orderType === "DINE_IN" && item.tableNumber) {
    return `Table ${item.tableNumber}`;
  }
  if (item.orderType === "DELIVERY") {
    return item.deliveryPlatform ?? "Delivery";
  }
  return `#${item.orderNumber}`;
};

export function AppBarNotch() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const { count: pendingOrdersCount } = usePendingOrdersCount();
  const { items } = useReadyToServeItems();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    readReadyToServeDismissed(storeId)
  );

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
  }, [storeId]);

  useEffect(() => {
    return appBus.on("ui:readyToServeDismissed", () => {
      setDismissed(readReadyToServeDismissed(storeId));
    });
  }, [storeId]);

  useEffect(() => {
    if (!expanded) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!containerRef.current?.contains(target)) setExpanded(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
    };
  }, [expanded]);

  const visibleReadyItems = useMemo(
    () => items.filter((item) => !dismissed.has(item.id)),
    [items, dismissed]
  );
  const readyCount = visibleReadyItems.length;
  const previewItems = visibleReadyItems.slice(0, 3);

  const label = t("appbar.kdsCounts", {
    pending: String(pendingOrdersCount),
    ready: String(readyCount),
  });

  return (
    <div
      ref={containerRef}
      className="appbar-notch-root"
    >
      {/* Notch pill – centered in header */}
      <div className="appbar-notch-anchor">
        <button
          type="button"
          onClick={() => {
            setExpanded((current) => !current);
          }}
          aria-label={label}
          title={label}
          className="appbar-notch-pill"
        >
          <span className="appbar-notch-pill-chip appbar-notch-pill-chip--warning">
            <LuChefHat size={13} />
            <span>{pendingOrdersCount}</span>
          </span>
          <span className="appbar-notch-divider" aria-hidden="true" />
          <span className="appbar-notch-pill-chip appbar-notch-pill-chip--success">
            <LuBellRing size={13} />
            <span>{readyCount}</span>
          </span>
        </button>
      </div>

      {/* Expanded card */}
      {expanded && (
        <div className="animate-notch-card-in appbar-notch-card">
          <div className="appbar-notch-card-header">
            <div>
              <p className="appbar-notch-title">
                {t("appbar.notch.title")}
              </p>
              <p className="appbar-notch-subtitle">{label}</p>
            </div>
            <button
              type="button"
              aria-label={t("common.close")}
              onClick={() => setExpanded(false)}
              className="appbar-notch-close"
            >
              <LuX size={16} />
            </button>
          </div>

          <div className="appbar-notch-stats">
            <div className="appbar-notch-stat-card">
              <div className="appbar-notch-stat-label appbar-notch-stat-label--warning">
                <LuChefHat size={15} />
                <span>
                  {t("appbar.notch.pending")}
                </span>
              </div>
              <p className="appbar-notch-stat-number">
                {pendingOrdersCount}
              </p>
            </div>
            <div className="appbar-notch-stat-card">
              <div className="appbar-notch-stat-label appbar-notch-stat-label--success">
                <LuBellRing size={15} />
                <span>
                  {t("appbar.notch.ready")}
                </span>
              </div>
              <p className="appbar-notch-stat-number">
                {readyCount}
              </p>
            </div>
          </div>

          <div className="appbar-notch-section">
            <p className="appbar-notch-section-title">
              {t("appbar.notch.readyPreview")}
            </p>
            {previewItems.length === 0 ? (
              <div className="appbar-notch-empty">
                {t("appbar.notch.noReady")}
              </div>
            ) : (
              <div className="appbar-notch-preview-list">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="appbar-notch-preview-item"
                  >
                    <div className="appbar-notch-preview-text">
                      <p className="appbar-notch-preview-name">
                        {item.productName} x{item.quantity}
                      </p>
                      <p className="appbar-notch-preview-meta">
                        {getItemContext(item)} · {item.stationName}
                      </p>
                    </div>
                    <Badge
                      variant="success"
                      size="sm"
                      className="appbar-notch-ready-badge shrink-0"
                    >
                      {t("kds.status.ready")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => {
              appBus.emit("ui:readyToServeRequested", {});
              setExpanded(false);
            }}
            size="sm"
            className="appbar-notch-action"
            disabled={readyCount <= 0}
          >
            <LuExternalLink size={15} />
            {t("serve.action.view")}
          </Button>
        </div>
      )}
    </div>
  );
}
