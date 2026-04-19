import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";

interface Props {
  /**
   * Selector used with `document.querySelector` to locate the target element.
   * Prefer stable `[data-onboarding-target="..."]` attributes.
   */
  targetSelector: string;
  message: string;
  /** Tooltip placement relative to the target. */
  placement?: "bottom" | "top" | "left" | "left-top";
  /** Optional "skip tour" label shown in the tooltip corner. */
  skipLabel?: string;
  onSkip?: () => void;
  /** Called when backdrop is clicked (outside the target rect). */
  onDismiss?: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 6;

/**
 * Full-screen coach mark: dims the page except around the target element
 * and anchors a tooltip next to it. Re-measures on resize / scroll.
 *
 * The "cutout" is implemented as an absolutely-positioned transparent box
 * with a huge box-shadow — no SVG mask needed. The cutout box is rendered
 * with `pointer-events: none` so the actual target element underneath
 * remains clickable.
 */
export function CoachMark({
  targetSelector,
  message,
  placement = "bottom",
  skipLabel,
  onSkip,
  onDismiss,
}: Props) {
  const [rect, setRect] = useState<TargetRect | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const el = document.querySelector(targetSelector) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    measure();
    const id = window.setInterval(measure, 400); // cheap polling for dynamic layouts
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [targetSelector]);

  // Allow ESC to dismiss for accessibility
  useEffect(() => {
    if (!onDismiss) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  if (!rect) return null;

  const tooltipStyle: React.CSSProperties = (() => {
    switch (placement) {
      case "top":
        return {
          top: rect.top - PADDING - 12,
          left: rect.left + rect.width / 2,
          transform: "translate(-50%, -100%)",
        };
      case "left":
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - PADDING - 12,
          transform: "translate(-100%, -50%)",
        };
      case "left-top":
        return {
          top: rect.top - PADDING,
          left: rect.left - PADDING - 12,
          transform: "translate(-100%, 0)",
        };
      case "bottom":
      default:
        return {
          top: rect.top + rect.height + PADDING + 12,
          left: rect.left + rect.width / 2,
          transform: "translate(-50%, 0)",
        };
    }
  })();

  return createPortal(
    <div
      className="fixed inset-0 z-[200] pointer-events-none"
      aria-live="polite"
    >
      {/* Backdrop + cutout (cutout has pointer-events-none so target is clickable).
          The `onDismiss` click handler lives on a sibling overlay below. */}
      <div
        className="absolute rounded-card pointer-events-none"
        style={{
          top: rect.top - PADDING,
          left: rect.left - PADDING,
          width: rect.width + PADDING * 2,
          height: rect.height + PADDING * 2,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          transition: "all 150ms ease",
        }}
      />

      {/* Click-to-dismiss catcher. Covers the dimmed area only (border around
          the cutout). Uses pointer-events-auto but the actual cutout region is
          occluded by the target which receives clicks naturally. */}
      {onDismiss ? (
        <button
          type="button"
          aria-label="dismiss"
          onClick={onDismiss}
          className="absolute inset-0 cursor-default pointer-events-auto"
          style={{ background: "transparent" }}
        />
      ) : null}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute pointer-events-auto",
          "rounded-card bg-card-bg border border-card-border shadow-lg",
          "px-4 py-3 max-w-[280px]",
        )}
        style={tooltipStyle}
        role="tooltip"
      >
        <p className="text-body text-text-primary leading-snug">{message}</p>
        {skipLabel && onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="mt-2 text-caption text-text-secondary hover:text-text-primary transition-colors"
          >
            {skipLabel}
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
