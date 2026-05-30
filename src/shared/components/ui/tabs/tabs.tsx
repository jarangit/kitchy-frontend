import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/shared/utils/cn";
import { TabsContext } from "./tabs.context";
import { useTabsContext } from "./tabs.context";
import type {
  TabListProps,
  TabProps,
  TabsProps,
  TabsSize,
} from "./tabs.types";

/* ---------------- Root ---------------- */

export function Tabs({
  value,
  onChange,
  variant = "chip",
  size = "md",
  className,
  children,
}: TabsProps) {
  const orderRef = useRef<string[]>([]);
  const [focusValue, setFocusValue] = useState<string | null>(null);

  const registerTab = useCallback((v: string) => {
    if (!orderRef.current.includes(v)) {
      orderRef.current = [...orderRef.current, v];
    }
  }, []);

  const unregisterTab = useCallback((v: string) => {
    orderRef.current = orderRef.current.filter((x) => x !== v);
  }, []);

  const getOrderedValues = useCallback(() => orderRef.current, []);

  const ctxValue = useMemo(
    () => ({
      value,
      onChange,
      variant,
      size,
      registerTab,
      unregisterTab,
      focusValue,
      setFocusValue,
      getOrderedValues,
    }),
    [
      value,
      onChange,
      variant,
      size,
      registerTab,
      unregisterTab,
      focusValue,
      getOrderedValues,
    ],
  );

  return (
    <TabsContext.Provider value={ctxValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ---------------- TabList ---------------- */

export function TabList({
  scrollable = false,
  fullWidth = false,
  className,
  children,
  "aria-label": ariaLabel,
}: TabListProps) {
  const { variant } = useTabsContext("TabList");

  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "bg-segment-bg border border-segment-border rounded-full p-1",
          fullWidth ? "flex w-full" : "inline-flex",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // chip
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
          "flex gap-3",
        scrollable
          ? "overflow-x-auto flex-nowrap whitespace-nowrap"
          : "flex-wrap",
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------------- Tab ---------------- */

const chipSizeStyles: Record<TabsSize, string> = {
  sm: "min-h-chip-height-sm px-chip-padding-x text-chip",
  md: "min-h-chip-height-md px-5 text-chip",
  lg: "min-h-chip-height-lg px-6 text-body",
};

export function Tab({
  value,
  icon,
  count,
  animateOnCountIncrease = false,
  disabled,
  className,
  children,
  onKeyDown,
  ...rest
}: TabProps) {
  const {
    value: activeValue,
    onChange,
    variant,
    size,
    registerTab,
    unregisterTab,
    focusValue,
    setFocusValue,
    getOrderedValues,
  } = useTabsContext("Tab");

  const isActive = activeValue === value;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(count ?? 0);

  useEffect(() => {
    registerTab(value);
    return () => unregisterTab(value);
  }, [value, registerTab, unregisterTab]);

  useEffect(() => {
    const next = count ?? 0;
    if (
      animateOnCountIncrease &&
      next > prevCount.current &&
      prevCount.current !== 0
    ) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 300);
      prevCount.current = next;
      return () => clearTimeout(t);
    }
    prevCount.current = next;
  }, [count, animateOnCountIncrease]);

  // Focus when focusValue matches this tab
  useEffect(() => {
    if (focusValue === value) {
      buttonRef.current?.focus();
    }
  }, [focusValue, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const order = getOrderedValues();
    if (order.length === 0) return onKeyDown?.(e);
    const idx = order.indexOf(value);
    let nextIdx = idx;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (idx + 1) % order.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (idx - 1 + order.length) % order.length;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = order.length - 1;
    } else {
      onKeyDown?.(e);
      return;
    }

    e.preventDefault();
    const nextValue = order[nextIdx];
    setFocusValue(nextValue);
    onChange(nextValue);
  };

  const handleClick = () => {
    if (disabled) return;
    setFocusValue(value);
    onChange(value);
  };

  const tabIndex = isActive ? 0 : -1;

  if (variant === "segmented") {
    return (
      <button
        ref={buttonRef}
        type="button"
        role="tab"
        aria-selected={isActive}
        tabIndex={tabIndex}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex items-center justify-center rounded-full",
          "min-h-chip-height-md px-5 text-segment font-segment whitespace-nowrap",
          "transition-colors duration-[var(--motion-fast)]",
          "flex-1",
          isActive
            ? "bg-segment-active-bg text-segment-active-text"
            : "text-segment-inactive-text hover:text-segment-inactive-text-hover",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }

  // chip
  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={tabIndex}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap gap-2",
        "rounded-full font-chip",
        "transition-colors duration-[var(--motion-fast)]",
        chipSizeStyles[size],
        isActive
          ? "bg-chip-active-bg text-chip-active-text"
          : "bg-chip-inactive-bg text-chip-inactive-text hover:bg-chip-inactive-bg-hover",
        bouncing && "bg-info-bg text-text-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>
        {children}
        {count !== undefined && (
          <span className={cn("ml-1", bouncing && "animate-ping")}>
            ({count})
          </span>
        )}
      </span>
    </button>
  );
}
