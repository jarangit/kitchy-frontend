import { Dialog } from "@headlessui/react";
import { useState } from "react";

export default function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded-radius-xs h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      >
        Open Modal
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-[var(--color-overlay)]" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-dialog-bg p-6 rounded-radius-xs shadow-xl w-full max-w-sm">
            <Dialog.Title className="text-subtitle font-[var(--weight-semibold)]">
              Confirm Delete
            </Dialog.Title>
            <p className="mt-2 text-text-secondary">
              Are you sure you want to delete this order?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
              >
                Cancel
              </button>
              <button className="text-danger font-[var(--weight-medium)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]">Delete</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
