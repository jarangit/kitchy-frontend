import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-[var(--label-font-weight)] text-[var(--label-text)] mb-[var(--space-1)]">
          {label}
        </label>
      )}
      <select
        className={`
          w-full
          h-[var(--select-height)]
          bg-[var(--select-bg)]
          border border-[var(--select-border)]
          rounded-[var(--select-radius)]
          px-[var(--space-3)]
          text-[var(--select-text)]
          text-sm
          outline-none
          transition-colors duration-[var(--motion-fast)]
          focus:border-[var(--select-border-focus)]
          ${className}
        `.trim()}
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
