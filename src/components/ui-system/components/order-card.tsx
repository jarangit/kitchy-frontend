import { format } from "date-fns";
import { FaClock, FaTrash } from "react-icons/fa";

interface OrderCardProps {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  createdAt: string;
}
interface Props {
  order: OrderCardProps;
  onDelete: (id: number) => void;
}

const OrderCard = ({ order, onDelete }: Props) => {
  const { id, orderNumber, type, createdAt } = order;
  const isToGo = type === "TOGO";
  const formattedCreatedAt = format(new Date(createdAt), "dd/MM/yy HH:mm");
  return (
    <div
      className={` rounded-xl p-4  relative ${
        isToGo ? "bg-red-100" : "bg-green-100"
      }`}
    >
      <div className="flex gap-2 items-center">
        <div className="md:text-4xl font-bold">#{orderNumber}</div>
        <div className="flex md:hidden items-center text-sm text-gray-700">
          <FaClock className="mr-1" />
          <span className="font-medium">{formattedCreatedAt}</span>
        </div>
      </div>
      <div className="hidden md:flex justify-between flex-wrap mt-4 gap-4">
        <div
          className={` inline-block px-2 py-1 text-white text-xs font-medium rounded-full min-w-[60px] text-center ${
            isToGo ? "bg-[#FF6B6B]" : "bg-[#34C759]"
          }`}
        >
          {isToGo ? "ToGo" : "Dine-in"}
        </div>

        <div className="flex items-center text-sm  text-gray-700 gap-1">
          <FaClock  />
          <span className="font-medium">{formattedCreatedAt}</span>
        </div>
      </div>

      <FaTrash
        className="absolute top-4 right-4 xl:right-4 xl:top-4 text-gray-600 cursor-pointer hover:text-red-600"
        onClick={() => onDelete(id)}
      />
    </div>
  );
};

export default OrderCard;
