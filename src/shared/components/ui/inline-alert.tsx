import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type InlineAlertTone = "danger" | "warning" | "success" | "info" | "default";

interface InlineAlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: InlineAlertTone;
  children: ReactNode;
}

const toneStyles: Record<InlineAlertTone, string> = {
  default: "border-border bg-surface-muted text-text-secondary",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning-bg text-warning",
  success: "border-success/30 bg-success-bg text-success",
  info: "border-info/30 bg-info-bg text-info",
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
        "rounded-card border px-3 py-2 text-body-sm",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
