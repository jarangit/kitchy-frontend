import { LuMaximize2, LuMinimize2 } from "react-icons/lu";
import { IconButton } from "@/shared/components/ui/icon-button";
import { useClock } from "@/shared/hooks/useClock";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { useKdsLayout } from "@/features/kds/components/kds-layout";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

interface Props {
  groups: KdsOrderGroup[];
}

const KdsStatsBar = ({ groups }: Props) => {
  const { t, language } = useTranslation();
  const { fullscreen, toggleFullscreen } = useKdsLayout();
  const now = useClock();

  const pendingCount = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const doneCount = groups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce((s, i) => s + (i.status === "READY" ? i.quantity : 0), 0),
    0,
  );

  const overdueCount = groups.reduce(
    (sum, g) =>
      sum +
      (Math.floor((now.getTime() - new Date(g.createdAt).getTime()) / 60000) >=
      15
        ? 1
        : 0),
    0,
  );

  const locale = language === "th" ? "th-TH" : "en-US";
  const timeLabel = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = now.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const fullscreenLabel = fullscreen
    ? t("kds.fullscreen.exit")
    : t("kds.fullscreen.enter");

  return (
    <div
      className={cn(
        "bg-primary px-4 py-3 text-on-primary",
        fullscreen ? "rounded-none" : "rounded-card",
      )}
    >
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-stretch lg:gap-6">
        <div className="grid grid-flow-col auto-cols-max divide-x divide-on-primary/12 lg:w-fit">
          <div className="flex w-fit flex-col items-center justify-center px-4 py-3 text-center lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.pendingLabel")}
            </span>
            <span className="mt-2 font-mono text-display font-bold leading-none tabular-nums text-on-primary">
              {pendingCount}
            </span>
          </div>
          <div className="flex w-fit flex-col items-center justify-center px-4 py-3 text-center lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.doneLabel")}
            </span>
            <span className="mt-2 font-mono text-display font-bold leading-none tabular-nums text-accent">
              {doneCount}
            </span>
          </div>
          <div className="flex w-fit flex-col items-center justify-center px-4 py-3 text-center lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.overdueLabel")}
            </span>
            <span className="mt-2 font-mono text-display font-bold leading-none tabular-nums text-danger">
              {overdueCount}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 lg:min-w-[240px]">
          <div className="text-right lg:min-w-[172px]">
            <p className="font-mono text-display font-bold leading-none tabular-nums text-on-primary">
              {timeLabel}
            </p>
            <p className="mt-2 text-subtitle text-on-primary/78">{dateLabel}</p>
          </div>
          <IconButton
            aria-label={fullscreenLabel}
            title={fullscreenLabel}
            onClick={toggleFullscreen}
            className="border border-on-primary/40 bg-on-primary/16 text-on-primary hover:bg-on-primary/24 hover:text-on-primary"
          >
            {fullscreen ? <LuMinimize2 size={16} /> : <LuMaximize2 size={16} />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default KdsStatsBar;
