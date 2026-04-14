import type { DateRangePreset } from "@/features/report/types/report.dto";

interface Props {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
}

const segments: { key: DateRangePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "7 Days" },
  { key: "month", label: "Month" },
];

const TimeSegmentControl = ({ value, onChange }: Props) => {
  return (
    <div className="inline-flex w-full sm:w-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full p-1 overflow-x-auto">
      {segments.map((s) => {
        const isActive = value === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`
              h-8 px-4 rounded-full text-sm font-medium whitespace-nowrap flex-1 sm:flex-none
              transition-all duration-[var(--motion-fast)]
              active:scale-[0.97]
              ${
                isActive
                  ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }
            `}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSegmentControl;
