import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

export type OperationsProgressTone = "default" | "warning" | "success";

export interface OperationsProgressStage {
  index: number;
  label: string;
  count: number;
  helperText?: string;
  tone: OperationsProgressTone;
  to?: string;
}

export interface OperationsProgressStripProps {
  stages: OperationsProgressStage[];
  className?: string;
}

const toneStyles: Record<OperationsProgressTone, string> = {
  default: "bg-info-bg border border-info-border",
  warning: "bg-warning-bg border border-warning-border",
  success: "bg-success-bg border border-success-border",
};

function StagePill({ stage }: { stage: OperationsProgressStage }) {
  const content = (
    <>
      <span className="text-body-sm font-medium leading-5 text-text-primary">
        {stage.label}
      </span>
      <span className="text-title font-semibold leading-none text-text-primary tabular-nums">
        {stage.count}
      </span>
    </>
  );

  const baseClass = cn(
    "flex flex-1 items-center justify-between gap-3 rounded-full px-4 py-3 transition-colors duration-fast",
    toneStyles[stage.tone],
  );

  if (stage.to) {
    return (
      <Link
        to={stage.to}
        className={cn(
          baseClass,
          "hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}

function ArrowSeparator() {
  return (
    <span
      aria-hidden="true"
      className="hidden shrink-0 items-center text-text-tertiary lg:flex"
    >
      <span className="text-caption tracking-[0.12em]">····</span>
      <span className="ml-1 text-body leading-none">›</span>
    </span>
  );
}

export function OperationsProgressStrip({
  stages,
  className,
}: OperationsProgressStripProps) {
  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
        {stages.map((stage, idx) => (
          <div key={stage.label} className="flex flex-1 items-center gap-2">
            <StagePill stage={stage} />
            {idx < stages.length - 1 ? <ArrowSeparator /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
