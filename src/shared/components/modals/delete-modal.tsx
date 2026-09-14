import { Button } from "@/shared/components/ui/button";
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
      {content ? (
        <p className="text-body-sm leading-6 text-text-secondary">{content}</p>
      ) : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        {onConfirm && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              handleClose();
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
