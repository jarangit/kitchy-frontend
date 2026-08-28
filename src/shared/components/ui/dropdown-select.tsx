import { useEffect, useId, useRef, useState } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

export interface DropdownSelectOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: DropdownSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function DropdownSelect({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel,
}: DropdownSelectProps) {
  const autoId = useId();
  const triggerId = id ?? `dropdown-select-${autoId}`;
  const listboxId = `${triggerId}-listbox`;
  const labelId = label ? `${triggerId}-label` : undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? "";

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setFocusedIndex(idx);
  }, [value, options]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener,
    );

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener,
      );
    };
  }, [open]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (e.key === "Enter" || e.key === " ") {
        const opt = options[focusedIndex];
        if (opt) onValueChange(opt.value);
        setOpen(false);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
      }
      return;
    }

    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((index + 1) % options.length);
      const next =
        containerRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]',
        )[(index + 1) % options.length];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + options.length) % options.length;
      setFocusedIndex(prev);
      const el =
        containerRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]',
        )[prev];
      el?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          className="mb-1 block text-label-comp font-label-comp text-label-comp-text"
        >
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2",
          "h-segment-height",
          "bg-select-bg",
          "border border-select-border",
          "rounded-select",
          "px-input-padding-x",
          "text-segment font-segment text-select-text",
          "outline-none",
          "transition-colors duration-fast",
          "focus:border-select-border-focus focus:ring-2 focus:ring-select-border-focus/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selectedOption && placeholder && "text-input-placeholder",
          className,
        )}
      >
        <span className="truncate text-left">{displayLabel}</span>
        <LuChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-text-tertiary transition-transform duration-fast",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          aria-label={ariaLabel}
          className={cn(
            "absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto",
            "bg-surface border border-border rounded-select shadow-md",
            "p-1",
          )}
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isFocused = index === focusedIndex;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isFocused ? 0 : -1}
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, index)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-body-sm",
                  "text-left transition-colors duration-fast",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
                  isSelected
                    ? "bg-selection-active-bg text-selection-active-text"
                    : "text-text-primary hover:bg-surface-hover",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <LuCheck size={16} aria-hidden="true" className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
