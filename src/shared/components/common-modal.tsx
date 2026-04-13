import { Dialog } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { closeModal } from "@/shared/store/slices/modal-slice";
import DeleteModal from "@/shared/components/modals/delete-modal";
import ErrorModal from "@/shared/components/modals/error-modal";

export default function GlobalModal() {
  const { isOpen, title, content, onConfirm, template, component } =
    useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-[var(--color-overlay)]" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[var(--dialog-bg)] p-6 rounded  max-w-[80vh] w-fit shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          {template === "DELETE" && (
            <DeleteModal content={content} onConfirm={onConfirm} />
          )}
          {template === "ERROR" && <ErrorModal />}
          {template === "EDIT" && component}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
