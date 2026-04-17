import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** Optional small hint below the value (e.g. comparison, unit). */
  hint?: ReactNode;
  /** Optional trailing visual (icon tile, sparkline). */
  trailing?: ReactNode;
  /** Accent the value color (for status-flavored stats). */
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
}

const toneText: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

/**
 * Compact metric tile for dashboards, list headers, and reports.
 * Uses component tokens; keep content minimal (label + number + optional hint).
 */
export function StatCard({
  label,
  value,
  hint,
  trailing,
  tone = "default",
  className,
  onClick,
}: StatCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-card border border-card-border bg-card-bg px-4 py-3 text-left",
        "transition-colors duration-[var(--motion-fast)]",
        onClick && "cursor-pointer hover:bg-card-bg-hover",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-caption text-text-tertiary">{label}</p>
        <p
          className={cn(
            "text-title font-semibold tabular-nums",
            toneText[tone],
          )}
        >
          {value}
        </p>
        {hint && <p className="text-caption text-text-tertiary">{hint}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Comp>
  );
}
