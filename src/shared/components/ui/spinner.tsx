import { LuLoaderCircle } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label; defaults to "Loading" literal. Consumers can pass translated string. */
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center text-current", className)}
    >
      <LuLoaderCircle className="animate-spin" size={sizeMap[size]} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
