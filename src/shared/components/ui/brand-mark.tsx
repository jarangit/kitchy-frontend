import { cn } from "@/shared/utils/cn";

type BrandMarkSize = "sm" | "md";

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
}

const sizeStyles: Record<BrandMarkSize, string> = {
  sm: "h-8 w-8 rounded-full text-caption",
  md: "h-12 w-12 rounded-lg text-title",
};

export function BrandMark({ size = "md", className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center border border-border bg-surface font-semibold text-text-primary",
        sizeStyles[size],
        className,
      )}
      aria-hidden="true"
    >
      K
    </div>
  );
}
