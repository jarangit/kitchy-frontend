import type { ReactNode } from "react";

export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  durationMs?: number;
  action?: ToastAction;
}

export interface ToastRecord extends ToastOptions {
  id: string;
  variant: ToastVariant;
  durationMs: number;
}
