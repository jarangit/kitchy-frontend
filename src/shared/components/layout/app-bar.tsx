import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuClock3, LuWifi, LuWifiOff } from "react-icons/lu";
import { BrandMark } from "@/shared/components/ui/brand-mark";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { cn } from "@/shared/utils/cn";
import { AppBarNotch } from "@/shared/components/layout/app-bar-notch";

const useClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const interval = window.setInterval(tick, 1_000);
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

  const locale = language === "th" ? "th-TH" : "en-US";
  const timeLabel = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = now.toLocaleDateString(locale, {
    day: "numeric",
    month: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg relative">
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2 text-caption text-text-secondary sm:px-4 sm:py-2.5 lg:px-6">
        {storeId ? (
          <Link
            to={`/store/${storeId}`}
            aria-label={t("appbar.storeFallback")}
            className="flex min-h-[52px] min-w-0 flex-1 items-center gap-3 rounded-full text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <BrandMark size="sm" />
            <span
              className="max-w-[120px] truncate text-text-primary sm:max-w-[180px] lg:max-w-[260px]"
              title={storeName || t("appbar.storeFallback")}
            >
              {storeName || t("appbar.storeFallback")}
            </span>
          </Link>
        ) : (
          <div className="flex min-h-[52px] min-w-0 flex-1 items-center gap-3 text-body text-text-primary">
            <BrandMark size="sm" />
             <span
               className="max-w-[120px] truncate text-text-primary sm:max-w-[180px] lg:max-w-[260px]"
               title={storeName || t("appbar.storeFallback")}
             >
              {storeName || t("appbar.storeFallback")}
            </span>
          </div>
        )}

        <AppBarNotch />

        <div className="flex shrink-0 items-center gap-2">
          <span
            className="inline-flex min-h-7 items-center gap-2 rounded-full bg-surface pl-2.5 pr-3 leading-none transition-colors duration-[var(--motion-fast)] hover:bg-surface-hover"
            aria-label={`${timeLabel} ${dateLabel}`}
            title={`${timeLabel} · ${dateLabel}`}
          >
            <LuClock3 size={13} className="text-text-tertiary" aria-hidden="true" />
            <span className="font-mono text-body tabular-nums text-text-primary">
              {timeLabel}
            </span>
            <span
              className="hidden h-3 w-px bg-border lg:inline-block"
              aria-hidden="true"
            />
            <span className="hidden text-caption text-text-tertiary lg:inline">
              {dateLabel}
            </span>
          </span>

          <span
            aria-label={isOnline ? t("appbar.online") : t("appbar.offline")}
            title={isOnline ? t("appbar.online") : t("appbar.offline")}
            className={cn(
              "hidden h-7 w-7 items-center justify-center rounded-full text-caption leading-none sm:inline-flex",
              isOnline ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            )}
          >
            {isOnline ? <LuWifi size={13} /> : <LuWifiOff size={13} />}
          </span>
        </div>
      </div>
    </header>
  );
}
