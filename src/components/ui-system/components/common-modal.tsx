import { Dialog } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { closeModal } from "../../../store/slices/modal-slice";

export default function GlobalModal() {
  const { isOpen, title, content, onConfirm } = useAppSelector(
    (state) => state.modal
  );
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded max-w-md w-full shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <p className="text-sm text-gray-600 mt-2">{content}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={handleClose} className="text-gray-500">
              Cancel
            </button>
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  handleClose();
                }}
                className="text-red-600 font-medium"
              >
                Confirm
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
