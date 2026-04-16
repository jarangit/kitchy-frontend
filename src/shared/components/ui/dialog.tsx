import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "backdrop:bg-[var(--dialog-overlay)]",
        "bg-[var(--dialog-bg)]",
        "border border-[var(--dialog-border)]",
        "rounded-[var(--dialog-radius)]",
        "p-[var(--dialog-padding)]",
        "w-full max-w-md m-auto",
        "max-h-[90vh] overflow-y-auto",
        "open:animate-in open:fade-in open:zoom-in-95",
        className,
      )}
    >
      {open && children}
    </dialog>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mb-[var(--space-5)]", className)}>{children}</div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={cn(
        "text-[length:var(--dialog-title-font-size)] font-[var(--dialog-title-font-weight)] text-[var(--color-text-primary)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-[length:var(--dialog-description-font-size)] text-[var(--color-text-secondary)] mt-1",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex justify-end gap-[var(--space-4)] mt-[var(--space-6)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
