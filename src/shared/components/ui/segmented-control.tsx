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
        "inline-flex bg-[var(--segment-bg)] border border-[var(--segment-border)]",
        "rounded-[var(--segment-radius)] p-1",
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
              "flex items-center justify-center rounded-[calc(var(--segment-radius)-4px)]",
              "px-4 h-8 text-[length:var(--segment-font-size)] font-[var(--segment-font-weight)] whitespace-nowrap",
              "transition-all duration-[var(--motion-fast)] active:scale-[0.97]",
              isActive
                ? "bg-[var(--segment-active-bg)] text-[var(--segment-active-text)]"
                : "text-[var(--segment-inactive-text)] hover:text-[var(--segment-inactive-text-hover)]",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
