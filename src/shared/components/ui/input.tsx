import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-[var(--label-font-weight)] text-[var(--label-text)] mb-[var(--space-1)]">
          {label}
        </label>
      )}
      <input
        className={`
          w-full
          h-[var(--input-height)]
          ${error ? "bg-[var(--color-danger-bg)]" : "bg-[var(--input-bg)]"}
          border
          ${error ? "border-[var(--color-danger)]" : "border-[var(--input-border)]"}
          rounded-[var(--input-radius)]
          px-[var(--input-padding-x)]
          text-[var(--input-text)]
          text-sm
          placeholder:text-[var(--input-placeholder)]
          outline-none
          transition-colors duration-[var(--motion-fast)]
          focus:border-[var(--input-border-focus)] focus:ring-2 focus:ring-[var(--input-border-focus)]/25
          disabled:opacity-50
          ${className}
        `.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-[var(--space-1)]">
          {error}
        </p>
      )}
    </div>
  );
}
