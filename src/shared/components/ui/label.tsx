import type { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-[length:var(--label-font-size)] font-[var(--label-font-weight)] text-[var(--label-text)]",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
