import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type InlineAlertTone = "danger" | "warning" | "success" | "info" | "default";

interface InlineAlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: InlineAlertTone;
  children: ReactNode;
}

const toneStyles: Record<InlineAlertTone, string> = {
  default: "bg-surface-muted text-text-secondary",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
  success: "bg-success-bg text-success",
  info: "bg-info-bg text-info",
};

export function InlineAlert({
  tone = "default",
  className,
  children,
  ...props
}: InlineAlertProps) {
  return (
    <div
      className={cn(
        "rounded-card px-3 py-2 text-body-sm",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
