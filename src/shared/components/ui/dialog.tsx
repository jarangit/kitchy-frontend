import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  inline?: boolean;
}

export function Dialog({
  open,
  onClose,
  children,
  className,
  inline = false,
}: DialogProps) {
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

  if (inline) {
    return <div className={className}>{children}</div>;
  }

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
        "rounded-dialog",
        "p-dialog-padding",
        "w-full max-w-md m-auto",
        "max-h-[90vh] overflow-y-auto",
        "",
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
  return <div className={cn("mb-5", className)}>{children}</div>;
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

export function DialogDescription(_props: {
  className?: string;
  children: ReactNode;
}) {
  return null;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mt-6 flex justify-end gap-4", className)}>
      {children}
    </div>
  );
}
