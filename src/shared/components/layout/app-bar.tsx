import { useEffect, useState } from "react";
import { LuClock3, LuWifi, LuWifiOff } from "react-icons/lu";
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
      <div className="flex py-4 min-w-0 items-center justify-between gap-2 px-3 text-caption text-text-secondary sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-[var(--weight-semibold)] text-text-primary">
            K
          </span>
          <span className="max-w-[140px] truncate text-text-primary sm:max-w-[220px] lg:max-w-[320px]">
            {storeName || t("appbar.storeFallback")}
          </span>
        </div>

        <AppBarNotch />

        <div className="flex shrink-0 items-center gap-1.5">
          <span
            aria-label={isOnline ? t("appbar.online") : t("appbar.offline")}
            title={isOnline ? t("appbar.online") : t("appbar.offline")}
            className={cn(
              "hidden h-6 w-6 items-center justify-center rounded-full text-[11px] leading-none sm:inline-flex",
              isOnline ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            )}
          >
            {isOnline ? <LuWifi size={13} /> : <LuWifiOff size={13} />}
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
