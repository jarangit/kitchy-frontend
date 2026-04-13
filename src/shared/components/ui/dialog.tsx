import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
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
      className={`
        backdrop:bg-[var(--dialog-overlay)]
        bg-[var(--dialog-bg)]
        border border-[var(--dialog-border)]
        rounded-[var(--dialog-radius)]
        p-[var(--dialog-padding)]
        w-full max-w-md
        shadow-xl
        open:animate-in open:fade-in open:zoom-in-95
      `.trim()}
    >
      {open && children}
    </dialog>
  );
}

export function DialogHeader({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mb-[var(--space-4)] ${className}`.trim()}>{children}</div>
  );
}

export function DialogTitle({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={`text-lg font-[var(--font-weight-bold)] text-[var(--color-text-primary)] ${className}`.trim()}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={`text-sm text-[var(--color-text-secondary)] mt-1 ${className}`.trim()}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex justify-end gap-[var(--space-3)] mt-[var(--space-5)] ${className}`.trim()}
    >
      {children}
    </div>
  );
}
