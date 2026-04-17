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
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex bg-segment-bg border border-segment-border",
        "rounded-segment p-1",
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
              "flex items-center justify-center rounded-sm",
              "px-4 h-8 text-segment font-segment whitespace-nowrap",
              "transition-colors duration-[var(--motion-fast)]",
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
