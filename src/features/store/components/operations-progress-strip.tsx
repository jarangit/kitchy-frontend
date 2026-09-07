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
  default: "border-border bg-surface text-text-secondary",
  warning: "border-warning bg-warning text-on-status",
  success: "border-success bg-success text-on-status",
};

function StagePill({ stage }: { stage: OperationsProgressStage }) {
  const content = (
    <div className="flex flex-col items-center text-center">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-caption font-semibold tabular-nums",
          toneStyles[stage.tone],
        )}
      >
        {stage.count}
      </span>
      <span className="mt-3 text-body-sm font-medium leading-5 text-text-primary">
        {stage.label}
      </span>
    </div>
  );

  const baseClass = cn(
    "flex flex-1 flex-col items-center justify-start rounded-card px-2 py-2 transition-colors duration-fast",
  );

  if (stage.to) {
    return (
      <Link
        to={stage.to}
        className={cn(
          baseClass,
          "hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}

export function OperationsProgressStrip({
  stages,
  className,
}: OperationsProgressStripProps) {
  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stages.map((stage, idx) => (
          <div key={stage.label} className="relative flex min-w-0 items-start">
            {idx > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 right-1/2 top-4 z-0 h-0.5",
                  "bg-border",
                )}
              />
            )}
            {idx < stages.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 right-0 top-4 z-0 h-0.5",
                  "bg-border",
                )}
              />
            )}
            <div className="relative z-10 flex w-full justify-center">
              <StagePill stage={stage} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
