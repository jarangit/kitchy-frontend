import type { ToastOptions, ToastVariant } from "@/shared/components/ui/toast/toast.types";

type ToastListener = (toast: ToastOptions & { id: string }) => void;
type DismissListener = (id?: string) => void;

const toastListeners = new Set<ToastListener>();
const dismissListeners = new Set<DismissListener>();

const createToastId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emitToast = (options: ToastOptions & { variant?: ToastVariant }) => {
  const toast = { id: createToastId(), ...options };
  toastListeners.forEach((listener) => listener(toast));
  return toast.id;
};

const createVariantToast = (variant: ToastVariant) => (options: Omit<ToastOptions, "variant">) =>
  emitToast({ ...options, variant });

export const toast = {
  show: emitToast,
  default: createVariantToast("default"),
  success: createVariantToast("success"),
  warning: createVariantToast("warning"),
  error: createVariantToast("error"),
  info: createVariantToast("info"),
  dismiss: (id?: string) => {
    dismissListeners.forEach((listener) => listener(id));
  },
  subscribe: (listener: ToastListener) => {
    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  },
  subscribeDismiss: (listener: DismissListener) => {
    dismissListeners.add(listener);
    return () => dismissListeners.delete(listener);
  },
};
