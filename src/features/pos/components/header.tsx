import { useEffect, useState } from "react";
import { LuShoppingCart, LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useNetworkQuality } from "@/shared/hooks/useNetworkQuality";
import { useTranslation } from "@/shared/i18n/use-translation";

const NetworkQualityIcon = ({
  level,
  isOnline,
}: {
  level: "poor" | "fair" | "good";
  isOnline: boolean;
}) => {
  const { t } = useTranslation();
  const activeBars = !isOnline ? 0 : level === "good" ? 3 : level === "fair" ? 2 : 1;
  const levelColor =
    !isOnline
      ? "var(--color-text-tertiary)"
      : level === "good"
      ? "var(--color-info)"
      : level === "fair"
      ? "var(--color-warning)"
      : "var(--color-danger)";

  const label = !isOnline
    ? t("pos.header.network.offline")
    : level === "good"
      ? t("pos.header.network.good")
      : level === "fair"
        ? t("pos.header.network.fair")
        : t("pos.header.network.poor");

  return (
    <div className="group relative">
      <div
        className="flex h-10 w-10 items-end justify-center gap-0.5 rounded-lg bg-[var(--color-bg)] px-1.5 py-2"
        title={label}
        aria-label={label}
        tabIndex={0}
      >
        {[1, 2, 3].map((bar) => {
          const heightClass = bar === 1 ? "h-2" : bar === 2 ? "h-3" : "h-4";
          const isActive = bar <= activeBars;

          return (
            <span
              key={bar}
              className={`w-1 rounded-sm ${heightClass}`}
              style={{
                backgroundColor: isActive
                  ? levelColor
                  : "var(--color-border)",
              }}
            />
          );
        })}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </div>
  );
};

interface Props {
  shopName: string;
  onCartClick?: () => void;
  cartItemCount?: number;
  onExit?: () => void;
}

const PosHeader = ({
  shopName,
  onCartClick,
  cartItemCount = 0,
  onExit,
}: Props) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isOnline, level } = useNetworkQuality();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-[var(--color-text-primary)]">
          {shopName}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl bg-[var(--color-surface)] px-3 py-1.5 sm:flex">
          <div className="text-right">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">
              {formattedTime}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              {formattedDate}
            </div>
          </div>
          <NetworkQualityIcon level={level} isOnline={isOnline} />
        </div>

        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <NetworkQualityIcon level={level} isOnline={isOnline} />
          </div>

          {/* Cart badge button — tablet only */}
          {onCartClick && (
            <div className="relative lg:hidden">
              <button
                onClick={onCartClick}
                aria-label={t("pos.header.openCart")}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] hover:bg-[var(--color-surface-hover)]"
              >
                <LuShoppingCart size={20} className="text-[var(--color-text-primary)]" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-info-bg)] px-1 text-xs font-bold text-[var(--color-info)]">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {onExit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExit}
            className="h-11 px-3"
          >
            <LuArrowLeft size={16} />
            {t("pos.header.exitPos")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PosHeader;
