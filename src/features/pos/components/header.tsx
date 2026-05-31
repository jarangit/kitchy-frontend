import { LuShoppingCart, LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { IconButton } from "@/shared/components/ui/icon-button";
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
  const { isOnline, level } = useNetworkQuality();

  return (
    <div className="flex items-center justify-between border-b border-border bg-bg px-6 py-5 sm:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-heading text-text-primary">
          {shopName}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div>
            <NetworkQualityIcon level={level} isOnline={isOnline} />
          </div>

          {/* Cart badge button — tablet only */}
          {onCartClick && (
            <div className="relative lg:hidden">
              <IconButton
                onClick={onCartClick}
                aria-label={t("pos.header.openCart")}
                size="lg"
                className="relative bg-surface"
              >
                <LuShoppingCart size={20} className="text-text-primary" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-caption font-semibold text-on-accent tabular-nums">
                    {cartItemCount}
                  </span>
                )}
              </IconButton>
            </div>
          )}
        </div>

        {onExit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExit}
            className="h-button-height-md px-5 text-body"
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
