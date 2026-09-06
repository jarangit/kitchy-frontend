import { useClock } from "@/shared/hooks/useClock";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { useKdsLayout } from "@/features/kds/components/kds-layout";
import { KdsControlGroup } from "@/features/kds/components/kds-controls";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

interface Props {
  groups: KdsOrderGroup[];
}

const KdsStatsBar = ({ groups }: Props) => {
  const { t, language } = useTranslation();
  const { fullscreen } = useKdsLayout();
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
  return (
    <div
      className={cn(
        "bg-primary px-3 py-2 text-on-primary sm:px-4",
        fullscreen ? "rounded-none" : "rounded-card",
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="grid min-w-0 grid-flow-col auto-cols-max divide-x divide-on-primary/12 overflow-x-auto lg:w-fit">
          <div className="flex w-fit flex-col items-center justify-center px-3 py-1.5 text-center sm:px-4 lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.pendingLabel")}
            </span>
            <span className="mt-1 font-mono text-title font-bold leading-none tabular-nums text-on-primary sm:text-display">
              {pendingCount}
            </span>
          </div>
          <div className="flex w-fit flex-col items-center justify-center px-3 py-1.5 text-center sm:px-4 lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.doneLabel")}
            </span>
            <span className="mt-1 font-mono text-title font-bold leading-none tabular-nums text-accent sm:text-display">
              {doneCount}
            </span>
          </div>
          <div className="flex w-fit flex-col items-center justify-center px-3 py-1.5 text-center sm:px-4 lg:py-0">
            <span className="text-caption text-on-primary/78">
              {t("kds.stats.overdueLabel")}
            </span>
            <span className="mt-1 font-mono text-title font-bold leading-none tabular-nums text-danger sm:text-display">
              {overdueCount}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:min-w-[200px]">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-title font-bold leading-none tabular-nums text-on-primary sm:text-display">
              {timeLabel}
            </p>
            <p className="mt-1 text-body-sm text-on-primary/78 sm:text-subtitle">
              {dateLabel}
            </p>
          </div>
          <KdsControlGroup variant="onPrimary" />
        </div>
      </div>
    </div>
  );
};

export default KdsStatsBar;
