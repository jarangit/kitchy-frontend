import { useEffect, useState } from "react";
import { LuShoppingCart, LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useNetworkQuality } from "@/shared/hooks/useNetworkQuality";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

const NetworkQualityIcon = ({
  level,
  isOnline,
}: {
  level: "poor" | "fair" | "good";
  isOnline: boolean;
}) => {
  const { t } = useTranslation();
  const activeBars = !isOnline ? 0 : level === "good" ? 3 : level === "fair" ? 2 : 1;
  const levelColorClass =
    !isOnline
      ? "bg-text-tertiary"
      : level === "good"
      ? "bg-info"
      : level === "fair"
      ? "bg-warning"
      : "bg-danger";

  const label = !isOnline
    ? t("pos.header.network.offline")
    : level === "good"
      ? t("pos.header.network.good")
      : level === "fair"
        ? t("pos.header.network.fair")
        : t("pos.header.network.poor");

  return (
    <div
      className="inline-flex h-4 shrink-0 items-end justify-center gap-0.5"
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
            className={cn(
              "w-1 rounded-xs",
              heightClass,
              isActive ? levelColorClass : "bg-border",
            )}
          />
        );
      })}
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
  });

  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between border-b border-border bg-bg px-5 py-5 sm:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-heading text-text-primary">
          {shopName}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div className="hidden h-12 shrink-0 grid-cols-[1rem_auto_1rem] items-center gap-3 overflow-hidden rounded-chip bg-chip-inactive-bg border border-border px-4 sm:grid">
          <span className="h-4 w-4" aria-hidden />
          <div className="text-center">
            <div className="text-body font-semibold leading-tight tabular-nums text-text-primary">
              {formattedTime}
            </div>
            <div className="text-caption leading-tight text-text-secondary">
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
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={onCartClick}
                aria-label={t("pos.header.openCart")}
                className="relative h-12 w-12 bg-surface"
              >
                <LuShoppingCart size={20} className="text-text-primary" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-caption font-semibold text-on-accent tabular-nums">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {onExit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExit}
            className="h-12 px-4 text-base"
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
