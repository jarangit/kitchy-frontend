import { LuSearch, LuX } from "react-icons/lu";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`.trim()}>
      <LuSearch
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          h-[var(--input-height)]
          bg-[var(--input-bg)]
          border border-[var(--input-border)]
          rounded-full
          pl-10 pr-10
          text-sm
          text-[var(--input-text)]
          placeholder:text-[var(--input-placeholder)]
          outline-none
          transition-colors duration-[var(--motion-fast)]
          focus:border-[var(--input-border-focus)]
        "
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-[var(--color-text-tertiary)]
            hover:text-[var(--color-text-primary)]
            transition-colors duration-[var(--motion-fast)]
            cursor-pointer
          "
          aria-label="Clear search"
        >
          <LuX size={16} />
        </button>
      )}
    </div>
  );
}
