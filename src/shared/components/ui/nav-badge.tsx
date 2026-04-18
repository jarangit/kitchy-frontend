import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

interface NavBadgeProps {
  count: number;
  max?: number;
  /**
   * When true, the badge briefly pulses whenever `count` increases.
   * Useful for drawing attention to new incoming activity.
   */
  pulseOnIncrease?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * Facebook-style notification badge: a small red pill with a number,
 * designed to sit at the top-right corner of a nav icon.
 *
 * The parent element must have `position: relative` for correct placement.
 * Renders nothing when `count <= 0`.
 */
export const NavBadge = ({
  count,
  max = 99,
  pulseOnIncrease = true,
  className,
  ...rest
}: NavBadgeProps) => {
  const [pulsing, setPulsing] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (!pulseOnIncrease) return;
    if (count > prevCountRef.current) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 1200);
      prevCountRef.current = count;
      return () => clearTimeout(t);
    }
    prevCountRef.current = count;
  }, [count, pulseOnIncrease]);

  if (count <= 0) return null;

  const label = count > max ? `${max}+` : String(count);

  return (
    <span
      aria-label={rest["aria-label"] ?? `${count}`}
      className={cn(
        "pointer-events-none absolute top-1 right-1 z-10 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-sidebar-bg",
        pulsing && "animate-pulse",
        className
      )}
    >
      {label}
    </span>
  );
};

export default NavBadge;
