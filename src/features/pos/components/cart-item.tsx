import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";

interface Props {
  item: ICartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {item.name}
        </div>
        <div className="text-xs text-gray-500">
          ฿{item.price.toFixed(2)} each
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <LuMinus size={14} />
        </button>
        <span className="text-sm font-semibold w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <LuPlus size={14} />
        </button>
      </div>
      <div className="text-sm font-semibold text-gray-800 w-20 text-right">
        ฿{(item.price * item.quantity).toFixed(2)}
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="ml-2 text-red-400 hover:text-red-600 transition-colors"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
