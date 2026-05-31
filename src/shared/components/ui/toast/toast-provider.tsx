import { useEffect, useMemo, useState } from "react";
import {
  LuBell,
  LuCheck,
  LuInfo,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/services/toast-service";
import { cn } from "@/shared/utils/cn";
import type { ToastRecord, ToastVariant } from "./toast.types";

const DEFAULT_TOAST_DURATION_MS = 6000;
const MAX_VISIBLE_TOASTS = 3;

const variantStyles: Record<ToastVariant, { shell: string; icon: string; iconNode: React.ReactNode }> = {
  default: {
    shell: "border-border bg-surface ring-border/40",
    icon: "bg-surface-hover text-text-secondary",
    iconNode: <LuBell size={20} />,
  },
  success: {
    shell: "border-success/30 bg-surface ring-success/10",
    icon: "bg-success-bg text-success",
    iconNode: <LuCheck size={20} />,
  },
  warning: {
    shell: "border-warning/30 bg-surface ring-warning/10",
    icon: "bg-warning-bg text-warning",
    iconNode: <LuTriangleAlert size={20} />,
  },
  error: {
    shell: "border-danger/30 bg-surface ring-danger/10",
    icon: "bg-danger-bg text-danger",
    iconNode: <LuX size={20} />,
  },
  info: {
    shell: "border-info/30 bg-surface ring-info/10",
    icon: "bg-info-bg text-info",
    iconNode: <LuInfo size={20} />,
  },
};

function ToastItem({ record, onDismiss }: { record: ToastRecord; onDismiss: (id: string) => void }) {
  const styles = variantStyles[record.variant];

  useEffect(() => {
    if (record.durationMs <= 0) return;

    const timeoutId = window.setTimeout(() => {
      onDismiss(record.id);
    }, record.durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [record.durationMs, record.id, onDismiss]);

  return (
    <div className={cn("rounded-card border p-4 shadow-xl ring-1", styles.shell)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", styles.icon)}>
          {styles.iconNode}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-title font-semibold text-text-primary">
            {record.title}
          </p>
          {record.description && (
            <p className="text-body-sm text-text-secondary">{record.description}</p>
          )}
          {record.action && (
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => {
                  record.action?.onClick();
                  onDismiss(record.id);
                }}
              >
                {record.action.label}
              </Button>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Close notification"
          onClick={() => onDismiss(record.id)}
          className="rounded-full p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <LuX size={18} />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider() {
  const [records, setRecords] = useState<ToastRecord[]>([]);

  const dismiss = useMemo(
    () => (id?: string) => {
      setRecords((current) => (id ? current.filter((record) => record.id !== id) : []));
    },
    []
  );

  useEffect(() => {
    const unsubscribeToast = toast.subscribe((incoming) => {
      const record: ToastRecord = {
        ...incoming,
        variant: incoming.variant ?? "default",
        durationMs: incoming.durationMs ?? DEFAULT_TOAST_DURATION_MS,
      };

      setRecords((current) => [record, ...current].slice(0, MAX_VISIBLE_TOASTS));
    });
    const unsubscribeDismiss = toast.subscribeDismiss(dismiss);

    return () => {
      unsubscribeToast();
      unsubscribeDismiss();
    };
  }, [dismiss]);

  if (records.length === 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] flex flex-col gap-3 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:w-[360px]">
      {records.map((record) => (
        <ToastItem key={record.id} record={record} onDismiss={dismiss} />
      ))}
    </div>
  );
}
