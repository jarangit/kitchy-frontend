import { format } from "date-fns";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosRepeat } from "react-icons/io";
import { FaClock, FaTrash } from "react-icons/fa";
import { useState } from "react";

interface OrderCardProps {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  createdAt: string;
  status: "PENDING" | "COMPLETED";
}
interface Props {
  order: OrderCardProps;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: "COMPLETED" | "PENDING") => void;
  isCanDelete?: boolean;
  isCanAction?: boolean;
}

const OrderCard = ({
  order,
  onDelete,
  onUpdateStatus,
  isCanDelete,
  isCanAction,
}: Props) => {
  const { id, orderNumber, type, createdAt, status } = order;
  const [isFading, setIsFading] = useState(false);
  const isToGo = type === "TOGO";
  const formattedCreatedAt = format(new Date(createdAt), "dd/MM/yy HH:mm");
  const handleUpdate = () => {
    setIsFading(true);
    setTimeout(() => {
      onUpdateStatus(id, status == "PENDING" ? "COMPLETED" : "PENDING");
      setIsFading(false);
    }, 300);
  };
  return (
    <div
      className={` rounded-xl p-4  relative  transition-opacity duration-300 ${
        isToGo ? "bg-red-100" : "bg-green-100"
      }
      ${isFading ? "opacity-0" : "opacity-100"}
      `}
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
          <FaClock />
          <span className="font-medium">{formattedCreatedAt}</span>
        </div>

        {/* button update status */}
        {isCanAction ? (
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg   w-full cursor-pointer ${
              status === "PENDING" ? "bg-[#0C60DC]" : "bg-[#770000]"
            }`}
            onClick={() => handleUpdate()}
          >
            {status === "PENDING" ? (
              <div className="flex items-center gap-2 justify-center">
                <FaCheckCircle />
                <div>Make A Done</div>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <IoIosRepeat size={25} />
                <div>Make A Pending</div>
              </div>
            )}
          </button>
        ) : (
          ""
        )}
      </div>

      {isCanDelete ? (
        <FaTrash
          className="absolute top-4 right-4 xl:right-4 xl:top-4 text-gray-600 cursor-pointer hover:text-red-600"
          onClick={() => onDelete(id)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default OrderCard;
