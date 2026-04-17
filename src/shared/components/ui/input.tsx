import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-label-comp font-label-comp text-label-comp-text mb-[var(--space-1)]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full h-input-height",
          error ? "bg-danger-bg" : "bg-input-bg",
          "border",
          error ? "border-danger" : "border-input-border",
          "rounded-input",
          "px-input-padding-x",
          "text-input-text text-input",
          "placeholder:text-input-placeholder",
          "outline-none",
          "transition-colors duration-[var(--motion-fast)]",
          "focus:border-input-border-focus focus:ring-2 focus:ring-input-border-focus/25",
          "disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger mt-[var(--space-1)]">
          {error}
        </p>
      )}
    </div>
  );
}
