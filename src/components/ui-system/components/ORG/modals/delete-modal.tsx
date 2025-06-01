import { useAppDispatch } from "@/hooks/hooks";
import { closeModal } from "@/store/slices/modal-slice";

type Props = {
  content?: string;
  onConfirm?: () => void;
};

const DeleteModal = ({ content, onConfirm }: Props) => {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <div>
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
    </div>
  );
};

export default DeleteModal;
