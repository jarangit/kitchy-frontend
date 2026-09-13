import { Link } from "react-router-dom";
import {
  LuBell,
  LuChevronRight,
  LuClipboardList,
  LuCookingPot,
} from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

export type OperationsProgressTone = "default" | "warning" | "success";

export interface OperationsProgressStage {
  index: number;
  label: string;
  count: number;
  helperText?: string;
  actionText?: string;
  tone: OperationsProgressTone;
  to?: string;
}

export interface OperationsProgressStripProps {
  stages: OperationsProgressStage[];
  className?: string;
}

const toneIconWrap: Record<OperationsProgressTone, string> = {
  default: "bg-surface-muted text-text-secondary",
  warning: "bg-warning-bg text-warning",
  success: "bg-success-bg text-success",
};

const toneIcon: Record<OperationsProgressTone, typeof LuClipboardList> = {
  default: LuClipboardList,
  warning: LuCookingPot,
  success: LuBell,
};

function StageCard({ stage }: { stage: OperationsProgressStage }) {
  const Icon = toneIcon[stage.tone];
  const ariaLabel = [stage.label, String(stage.count), stage.helperText]
    .filter(Boolean)
    .join(", ");

  const content = (
    <div className="flex h-full min-h-40 flex-col gap-4 p-5 sm:min-h-44 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption font-medium tracking-wide text-text-tertiary">
          Step {stage.index}
        </span>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            toneIconWrap[stage.tone],
          )}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-display tabular-nums tracking-tight text-text-primary">
          {stage.count}
        </span>
        <span className="text-subtitle font-semibold text-text-primary">
          {stage.label}
        </span>
        {stage.helperText ? (
          <span className="text-body-sm leading-6 text-text-tertiary">
            {stage.helperText}
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center gap-1 pt-1 text-body-sm font-medium text-info">
        {stage.actionText ? <span>{stage.actionText}</span> : null}
        <LuChevronRight size={16} aria-hidden="true" />
      </div>
    </div>
  );

  const baseClass = cn(
    "block h-full rounded-card bg-card-bg transition-colors duration-fast",
  );

  if (stage.to) {
    return (
      <Link
        to={stage.to}
        aria-label={ariaLabel}
        className={cn(
          baseClass,
          "hover:bg-card-bg-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClass} aria-label={ariaLabel}>
      {content}
    </div>
  );
}

export function OperationsProgressStrip({
  stages,
  className,
}: OperationsProgressStripProps) {
  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stages.map((stage) => (
          <StageCard key={stage.label} stage={stage} />
        ))}
      </div>
    </div>
  );
}
