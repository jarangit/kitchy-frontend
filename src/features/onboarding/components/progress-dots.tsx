import { cn } from "@/shared/utils/cn";

interface Props {
  total: number;
  current: number;
}

/**
 * Simple dot indicator: ● for completed/current, ○ for upcoming.
 * `current` is 1-based.
 */
export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2" role="progressbar"
      aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i < current;
        return (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full transition-colors duration-[var(--motion-fast)]",
              isActive ? "bg-accent" : "bg-border",
            )}
          />
        );
      })}
    </div>
  );
}
