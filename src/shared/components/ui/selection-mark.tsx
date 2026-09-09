import { cn } from "@/shared/utils/cn";

interface SelectionMarkProps {
  shape: "circle" | "square";
  checked: boolean;
  className?: string;
}

/**
 * Single/checkbox glyph shared by POS option rows, the modifier POS preview,
 * and selection-card radios. Matches the POS dialog rendering exactly.
 */
export function SelectionMark({
  shape,
  checked,
  className,
}: SelectionMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center border",
        shape === "circle" ? "rounded-full" : "rounded-sm",
        checked ? "border-accent bg-accent" : "border-card-border bg-bg",
        className,
      )}
    >
      {checked &&
        (shape === "circle" ? (
          <span className="h-2 w-2 rounded-full bg-on-accent" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-[2px] bg-on-accent" />
        ))}
    </span>
  );
}
