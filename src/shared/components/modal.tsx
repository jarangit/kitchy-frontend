import { Dialog } from "@headlessui/react";
import { useState } from "react";

export default function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Open Modal
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-xl w-full max-w-sm">
            <Dialog.Title className="text-lg font-bold">
              Confirm Delete
            </Dialog.Title>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this order?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button className="text-red-600 font-medium">Delete</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
