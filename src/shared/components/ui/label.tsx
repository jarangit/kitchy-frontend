import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", children, ...props }: LabelProps) {
  return (
    <label
      className={`
        block text-sm
        font-[var(--label-font-weight)]
        text-[var(--label-text)]
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </label>
  );
}
