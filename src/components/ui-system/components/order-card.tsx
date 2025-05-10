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

  return (
    <div
      className={`rounded-2xl p-4 mb-3 shadow-sm relative ${
        isToGo ? "bg-red-100" : "bg-green-100"
      }`}
    >
      <div className="text-xl font-bold">#{orderNumber}</div>

      <div
        className={`mt-2 inline-block px-4 py-1 text-white text-sm font-medium rounded-full ${
          isToGo ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isToGo ? "ToGo" : "Dine-in"}
      </div>

      <div className="flex items-center text-sm mt-2 text-gray-700">
        <FaClock className="mr-1" />
        <span>: {createdAt}</span>
        {/* <span className="ml-2 text-red-500">({timeAgo})</span> */}
      </div>

      <FaTrash
        className="absolute right-4 top-4 text-gray-600 cursor-pointer hover:text-red-600"
        onClick={() => onDelete(id)}
      />
    </div>
  );
};

export default OrderCard;
