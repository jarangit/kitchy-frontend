import { useAppDispatch } from "@/shared/hooks/hooks";
import { closeModal } from "@/shared/store/slices/modal-slice";

type Props = {
  content?: string;
  onConfirm?: () => void;
};

const DeleteModal = ({ content, onConfirm }: Props) => {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <div>
      <p className="text-sm text-[var(--color-text-secondary)] mt-2">{content}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={handleClose} className="text-[var(--color-text-secondary)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]">
          Cancel
        </button>
        {onConfirm && (
          <button
            onClick={() => {
              onConfirm();
              handleClose();
            }}
            className="text-[var(--color-danger)] font-medium active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
