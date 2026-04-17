import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { closeModal } from "@/shared/store/slices/modal-slice";
import DeleteModal from "@/shared/components/modals/delete-modal";
import ErrorModal from "@/shared/components/modals/error-modal";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export default function GlobalModal() {
  const { isOpen, title, content, onConfirm, template, component } =
    useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="w-fit max-w-[80vh]"
    >
      {title && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      )}
      {template === "DELETE" && (
        <DeleteModal content={content} onConfirm={onConfirm} />
      )}
      {template === "ERROR" && <ErrorModal />}
      {template === "EDIT" && component}
    </Dialog>
  );
}
