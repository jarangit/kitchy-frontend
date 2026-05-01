import type { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-label-comp font-label-comp text-label-comp-text",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
