import { cn } from "@/shared/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center",
        "w-toggle-width h-toggle-height",
        "rounded-full",
        "transition-colors duration-[var(--motion-fast)]",
        checked ? "bg-toggle-bg-active" : "bg-toggle-bg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-toggle-knob-size w-toggle-knob-size rounded-full bg-toggle-knob transition-transform duration-[var(--motion-fast)]",
          checked
            ? "translate-x-[calc(var(--spacing-toggle-width)-var(--spacing-toggle-knob-size)-3px)]"
            : "translate-x-[3px]",
        )}
      />
    </button>
  );
}
