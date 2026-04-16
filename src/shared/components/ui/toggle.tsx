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
        "w-[var(--toggle-width)] h-[var(--toggle-height)]",
        "rounded-full",
        "transition-colors duration-[var(--motion-fast)]",
        "active:scale-[0.95]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      style={{
        backgroundColor: checked
          ? "var(--toggle-bg-active)"
          : "var(--toggle-bg)",
      }}
    >
      <span
        className="pointer-events-none inline-block w-[var(--toggle-knob-size)] h-[var(--toggle-knob-size)] rounded-full bg-[var(--toggle-knob)] transition-transform duration-[var(--motion-fast)]"
        style={{
          transform: checked ? "translateX(27px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}
