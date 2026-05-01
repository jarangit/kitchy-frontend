import { useEffect, useMemo, useState } from "react";
import { LuBellRing, LuClock3, LuWifi, LuWifiOff } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { readReadyToServeDismissed } from "@/features/kds/utils/ready-to-serve-dismissed";
import { cn } from "@/shared/utils/cn";

const useClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return now;
};

export function AppBar() {
  const { t, language } = useTranslation();
  const now = useClock();
  const isOnline = useNetworkStatus();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const storeName = useAppSelector((state) => state.currentStore.storeName);
  const stationName = useAppSelector((state) => state.currentStation.stationName);
  const { items } = useReadyToServeItems();
  const [dismissed, setDismissed] = useState(() => readReadyToServeDismissed(storeId));

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
  }, [storeId]);

  useEffect(() => {
    return appBus.on("ui:readyToServeDismissed", () => {
      setDismissed(readReadyToServeDismissed(storeId));
    });
  }, [storeId]);

  const readyCount = useMemo(
    () => items.filter((item) => !dismissed.has(item.id)).length,
    [items, dismissed]
  );

  const locale = language === "th" ? "th-TH" : "en-US";
  const timeLabel = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = now.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="sticky top-0 z-40 h-12 border-b border-border/70 bg-bg/82 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/72">
      <div className="flex h-12 min-w-0 items-center justify-between gap-2 px-3 text-caption text-text-secondary sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-[var(--weight-semibold)] text-text-primary">
            K
          </span>
          <span className="max-w-[140px] truncate text-text-primary sm:max-w-[220px] lg:max-w-[320px]">
            {storeName || t("appbar.storeFallback")}
          </span>
          {stationName && (
            <>
              <span className="hidden text-text-tertiary sm:inline">/</span>
              <span className="hidden max-w-[160px] truncate sm:inline lg:max-w-[220px]">
                {stationName}
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {readyCount > 0 && (
            <button
              type="button"
              onClick={() => appBus.emit("ui:readyToServeRequested", {})}
              className="inline-flex h-6 items-center gap-1 rounded-full bg-warning-bg px-2 text-[11px] font-[var(--weight-semibold)] leading-none text-warning transition-colors hover:bg-warning/15"
            >
              <LuBellRing size={13} />
              <span className="hidden md:inline">
                {t("appbar.ready", { count: String(readyCount) })}
              </span>
              <span className="md:hidden">{readyCount}</span>
            </button>
          )}

          <span
            className={cn(
              "hidden h-6 items-center gap-1 rounded-full px-2 text-[11px] leading-none sm:inline-flex",
              isOnline ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            )}
          >
            {isOnline ? <LuWifi size={13} /> : <LuWifiOff size={13} />}
            <span className="hidden md:inline">
              {isOnline ? t("appbar.online") : t("appbar.offline")}
            </span>
          </span>

          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-surface px-2 text-[11px] leading-none text-text-secondary">
            <LuClock3 size={13} />
            <span className="hidden lg:inline">{dateLabel}</span>
            <span className="text-text-primary">{timeLabel}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
