import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-[length:var(--label-font-size)] font-[var(--label-font-weight)] text-[var(--label-text)] mb-[var(--space-1)]">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full h-[var(--select-height)]",
          "bg-[var(--select-bg)]",
          "border border-[var(--select-border)]",
          "rounded-[var(--select-radius)]",
          "px-[var(--space-3)]",
          "text-[var(--select-text)] text-[length:var(--select-font-size)]",
          "outline-none",
          "transition-colors duration-[var(--motion-fast)]",
          "focus:border-[var(--select-border-focus)] focus:ring-2 focus:ring-[var(--select-border-focus)]/25",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
