import { useEffect, useMemo, useRef, useState } from "react";
import { LuBellRing, LuChefHat, LuExternalLink, LuX } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
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
      className="pointer-events-none absolute inset-0 z-10"
    >
      {/* Notch pill – centered in header */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            setExpanded((current) => !current);
          }}
          aria-label={label}
          title={label}
          className="pointer-events-auto relative z-20 inline-flex h-7 items-center justify-center gap-2 rounded-full bg-text-primary px-3 text-[11px] font-[var(--weight-semibold)] leading-none text-white shadow-lg transition-transform duration-[var(--motion-fast)] hover:scale-[1.03]"
        >
          <span className="inline-flex items-center gap-1 text-white">
            <LuChefHat size={13} className="text-amber-300" />
            <span className="tabular-nums">{pendingOrdersCount}</span>
          </span>
          <span className="h-3 w-px bg-white/25" aria-hidden="true" />
          <span className="inline-flex items-center gap-1 text-white">
            <LuBellRing size={13} className="text-emerald-300" />
            <span className="tabular-nums">{readyCount}</span>
          </span>
        </button>
      </div>

      {/* Expanded card */}
      {expanded && (
        <div className="animate-notch-card-in pointer-events-auto absolute left-1/2 top-full z-10 mt-2 w-[min(92vw,380px)]  rounded-[28px] bg-text-primary p-4 text-white shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-title font-[var(--weight-semibold)] text-white">
                {t("appbar.notch.title")}
              </p>
              <p className="mt-0.5 text-caption text-white/60">{label}</p>
            </div>
            <button
              type="button"
              aria-label={t("common.close")}
              onClick={() => setExpanded(false)}
              className="rounded-full p-1.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LuX size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-amber-300">
                <LuChefHat size={15} />
                <span className="text-caption font-[var(--weight-semibold)]">
                  {t("appbar.notch.pending")}
                </span>
              </div>
              <p className="text-heading font-[var(--weight-semibold)] text-white tabular-nums">
                {pendingOrdersCount}
              </p>
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-emerald-300">
                <LuBellRing size={15} />
                <span className="text-caption font-[var(--weight-semibold)]">
                  {t("appbar.notch.ready")}
                </span>
              </div>
              <p className="text-heading font-[var(--weight-semibold)] text-white tabular-nums">
                {readyCount}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-caption font-[var(--weight-semibold)] text-white/60">
              {t("appbar.notch.readyPreview")}
            </p>
            {previewItems.length === 0 ? (
              <div className="rounded-2xl bg-white/8 p-3 text-body-sm text-white/60">
                {t("appbar.notch.noReady")}
              </div>
            ) : (
              <div className="space-y-2">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-[var(--weight-semibold)] text-white">
                        {item.productName} x{item.quantity}
                      </p>
                      <p className="truncate text-caption text-white/55">
                        {getItemContext(item)} · {item.stationName}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-300/15 px-2 py-1 text-[10px] font-[var(--weight-semibold)] text-emerald-200">
                      {t("kds.status.ready")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              appBus.emit("ui:readyToServeRequested", {});
              setExpanded(false);
            }}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-white text-label font-[var(--weight-semibold)] text-text-primary transition-colors hover:bg-white/90 disabled:opacity-50"
            disabled={readyCount <= 0}
          >
            <LuExternalLink size={15} />
            {t("serve.action.view")}
          </button>
        </div>
      )}
    </div>
  );
}
