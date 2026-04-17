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
        "backdrop:bg-dialog-overlay",
        "bg-dialog-bg",
        "border border-dialog-border",
        "rounded-dialog",
        "p-dialog-padding",
        "w-full max-w-md m-auto",
        "max-h-[90vh] overflow-y-auto",
        "shadow-sm",
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
    <div className={cn("mb-5", className)}>{children}</div>
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
        "text-dialog-title font-dialog-title text-text-primary",
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
        "text-dialog-desc text-text-secondary mt-1",
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
          "mt-6 flex justify-end gap-4",
          className,
        )}
    >
      {children}
    </div>
  );
}
