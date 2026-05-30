import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface SegmentedControlItem<T extends string> {
  key: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** When true, fills container width and items share space equally. */
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "bg-segment-bg border border-segment-border rounded-segment p-1",
        fullWidth ? "flex w-full" : "inline-flex",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "flex min-h-chip-height-md items-center justify-center rounded-sm",
              "px-5 text-segment font-segment whitespace-nowrap",
              "transition-colors duration-[var(--motion-fast)]",
              fullWidth && "flex-1",
              isActive
                ? "bg-segment-active-bg text-segment-active-text"
                : "text-segment-inactive-text hover:text-segment-inactive-text-hover",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
