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
      <div className="fixed inset-0 bg-dialog-overlay" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-dialog-bg p-6 rounded-radius-xs  max-w-[80vh] w-fit ">
          <Dialog.Title className="text-subtitle">{title}</Dialog.Title>
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
