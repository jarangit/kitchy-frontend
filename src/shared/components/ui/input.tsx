import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, ...props },
  ref,
) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-label-comp font-label-comp text-label-comp-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
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
          "focus:border-input-border-focus focus:ring-2 focus:ring-input-border-focus/10",
          "disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
