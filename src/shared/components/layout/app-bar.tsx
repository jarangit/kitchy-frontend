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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/82 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/72 relative">
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-4 text-caption text-text-secondary sm:px-4 lg:px-6">
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
            aria-label={isOnline ? t("appbar.online") : t("appbar.offline")}
            title={isOnline ? t("appbar.online") : t("appbar.offline")}
            className={cn(
              "hidden h-7 w-7 items-center justify-center rounded-full text-caption leading-none sm:inline-flex",
              isOnline ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            )}
          >
            {isOnline ? <LuWifi size={13} /> : <LuWifiOff size={13} />}
          </span>

          <span className="inline-flex min-h-7 items-center gap-1 rounded-full bg-surface px-2.5 text-caption leading-none text-text-secondary">
            <LuClock3 size={13} />
            <span className="hidden lg:inline">{dateLabel}</span>
            <span className="text-text-primary">{timeLabel}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
