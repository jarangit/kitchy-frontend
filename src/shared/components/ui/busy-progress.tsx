import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { getBusyProgressState } from "@/shared/components/ui/busy-progress.utils";

interface Props {
  count: number;
  limit: number;
  className?: string;
}

export function BusyProgress({ count, limit, className }: Props) {
  const { t } = useTranslation();
  const { ratio, state } = getBusyProgressState(count, limit);
  const labelKey =
    state === "veryBusy"
      ? "kds.stats.level.veryBusy"
      : state === "busy"
        ? "kds.stats.level.busy"
        : "kds.stats.level.normal";
  const label = t(labelKey);
  const progressClassName =
    state === "veryBusy"
      ? "bg-danger"
      : state === "busy"
        ? "bg-warning"
        : "bg-success";

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative h-7 overflow-hidden rounded-full bg-text-inverse/10"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={count}
        aria-valuetext={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-[var(--motion-fast)]",
            progressClassName,
          )}
          style={{ width: `${ratio * 100}%` }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-medium leading-none text-text-inverse">
          {label}
        </div>
      </div>
    </div>
  );
}
