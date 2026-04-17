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
        <label className="mb-1 block text-label-comp font-label-comp text-label-comp-text">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full h-select-height",
          "bg-select-bg",
          "border border-select-border",
          "rounded-select",
          "px-3",
          "text-select-text text-select",
          "outline-none",
          "transition-colors duration-[var(--motion-fast)]",
          "focus:border-select-border-focus focus:ring-2 focus:ring-select-border-focus/10",
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
