import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onEditNote: (item: ICartItem) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove, onEditNote }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <p
          className="min-w-0 flex-1 line-clamp-1 text-body font-[var(--weight-semibold)] text-text-primary"
          title={item.name}
        >
          {item.name}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.productId)}
          className="shrink-0 rounded-sm text-text-tertiary hover:bg-danger-bg hover:text-danger"
        >
          <LuTrash2 size={18} />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 rounded-full bg-surface px-1.5 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <LuMinus size={18} />
          </Button>
          <span className="min-w-8 text-center text-body font-[var(--weight-semibold)] tabular-nums text-text-primary">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <LuPlus size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditNote(item)}
            className="rounded-full text-text-secondary hover:bg-surface hover:text-text-primary"
          >
            {item.note ? t("pos.cart.editNote") : t("pos.cart.addNote")}
          </Button>
          <p className="text-label text-text-secondary tabular-nums">
            ฿{item.price.toFixed(2)}/ea
          </p>
          <p className="text-body font-[var(--weight-semibold)] tabular-nums text-text-primary">
            ฿{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
