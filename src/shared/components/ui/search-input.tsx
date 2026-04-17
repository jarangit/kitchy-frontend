import { LuSearch, LuX } from "react-icons/lu";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <LuSearch
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-input-height",
          "bg-input-bg",
          "border border-input-border",
          "rounded-full pl-10 pr-10",
          "text-input text-input-text",
          "placeholder:text-input-placeholder",
          "outline-none",
          "transition-colors duration-[var(--motion-fast)]",
          "focus:border-input-border-focus focus:ring-2 focus:ring-input-border-focus/10",
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-tertiary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
          aria-label="Clear search"
        >
          <LuX size={16} />
        </button>
      )}
    </div>
  );
}
