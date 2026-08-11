import { Link } from "react-router-dom";
import { LuArrowLeft, LuClock3 } from "react-icons/lu";
import { BusyProgress } from "@/shared/components/ui/busy-progress";
import { useClock } from "@/shared/hooks/useClock";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

interface Props {
  groups: KdsOrderGroup[];
  orderLimit: number;
}

const KdsStatsBar = ({ groups, orderLimit }: Props) => {
  const { t, language } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const now = useClock();

  const itemCount = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const longestWaitMinutes = groups.reduce(
    (max, g) =>
      Math.max(
        max,
        Math.floor((now.getTime() - new Date(g.createdAt).getTime()) / 60000),
      ),
    0,
  );

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
    <div className="rounded-card bg-primary px-4 py-2.5 text-on-primary">
      <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,340px)_minmax(0,1fr)] sm:items-center sm:gap-3">
        <span className="flex items-baseline gap-2 sm:justify-self-start">
          <span className="text-caption font-medium tracking-wider text-on-primary/60">
            {t("kds.stats.itemsLabel")}
          </span>
          <span className="font-mono text-title font-bold leading-none tabular-nums text-on-primary">
            {itemCount}
          </span>
          <span className="text-on-primary/30">/</span>
          <span className="font-mono text-body font-semibold tabular-nums text-on-primary/80">
            {orderLimit}
          </span>
        </span>

        <BusyProgress
          count={itemCount}
          limit={orderLimit}
          className="w-full justify-self-center"
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:justify-self-end">
          <span
            aria-label={`${timeLabel} ${dateLabel}`}
            title={`${timeLabel} · ${dateLabel}`}
            className="flex items-center gap-2 text-on-primary/80"
          >
            <LuClock3
              size={14}
              className="text-on-primary/60"
              aria-hidden="true"
            />
            <span className="font-mono text-body tabular-nums text-on-primary">
              {timeLabel}
            </span>
            <span
              className="hidden h-3 w-px bg-on-primary/20 sm:inline-block"
              aria-hidden="true"
            />
            <span className="text-caption font-medium text-on-primary/70">
              {dateLabel}
            </span>
          </span>

          {groups.length > 0 && (
            <span
              aria-label={t("kds.stats.longestWait")}
              title={t("kds.stats.longestWait")}
              className="flex items-center gap-1.5 text-on-primary/80"
            >
              <LuClock3
                size={14}
                className="text-on-primary/60"
                aria-hidden="true"
              />
              <span className="text-caption font-medium text-on-primary/70">
                {t("kds.stats.longestWait")}
              </span>
              <span className="font-mono text-body font-semibold tabular-nums text-on-primary">
                {longestWaitMinutes}
              </span>
              <span className="text-caption font-medium text-on-primary/70">
                {t("kds.card.minutesUnit")}
              </span>
            </span>
          )}

          {storeId ? (
            <Link
              to={`/store/${storeId}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-on-primary/30 bg-on-primary/10 px-3 text-caption font-semibold tracking-wider text-on-primary transition-colors hover:bg-on-primary/20"
            >
              <LuArrowLeft size={15} />
              {t("kds.header.back")}
            </Link>
          ) : (
            <span className="hidden sm:block" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
};

export default KdsStatsBar;
