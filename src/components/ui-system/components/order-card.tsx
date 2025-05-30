// TODO: card dine in @ToGo add yellow badge text is "Table"
// TODO: add badge for ToGo waiting in store text is "Waiting"
// TODO: show edit and delete button when isCanAction is true
// TODO: open popup when click edit button
// TODO: affter edited show old value and new value and some animation for tell user edit is success
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { IoIosRepeat, IoMdCloseCircle } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ElapsedTime from "./elapsed-time";

interface OrderCardProps {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  createdAt: string;
  status: "PENDING" | "COMPLETED";
  isWaitingInStore?: boolean;
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
  const { id, orderNumber, type, createdAt, status, isWaitingInStore } = order;
  const [isFading, setIsFading] = useState(false);
  const isToGo = type === "TOGO";
  const [isShowDeleteButton, setIsShowDeleteButton] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  // แปลงวันที่เป็น timezone ของ user
  // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const createdAtZoned = toZonedTime(new Date(createdAt), userTimeZone);
  // const formattedCreatedAt = format(createdAtZoned, "dd/MM/yy HH:mm");
  const handleUpdate = () => {
    setIsFading(true);
    setTimeout(() => {
      onUpdateStatus(id, status == "PENDING" ? "COMPLETED" : "PENDING");
      setIsFading(false);
    }, 300);
  };

  // ฟังก์ชันปิดเมื่อ click ด้านนอก
  useEffect(() => {
    if (!isShowDeleteButton) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setIsShowDeleteButton(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShowDeleteButton]);
  return (
    <div
      className={`w-full h-full rounded-xl p-4  relative  transition-opacity duration-300 flex flex-col justify-between gap-3 ${
        isToGo ? "bg-red-100" : "bg-green-100"
      }
      ${!isToGo && isWaitingInStore && "!bg-[#D3CBFF]"}
      ${isFading ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="md:text-4xl font-bold">#{orderNumber}</div>
          <div className="flex md:hidden items-center text-sm text-gray-700">
            <FaClock className="mr-1" />
            <ElapsedTime createdAt={createdAt} />
          </div>
        </div>
        <div className="hidden md:flex justify-between flex-wrap gap-3 flex-col">
          <div className="flex flex-wrap gap-2">
            <div
              className={` inline-block px-3 py-1 text-black font-bold text-lg rounded-full min-w-[60px] text-center ${
                isToGo ? "bg-[#FF6B6B]" : "bg-[#34C759]"
              }`}
            >
              {isToGo ? "ToGo" : "Dine-in"}
            </div>

            {isWaitingInStore ? (
              <div
                className={` inline-block px-3 py-1 text-black font-bold text-lg rounded-full min-w-[60px] text-center bg-yellow-300`}
              >
                {isToGo ? "@Wait" : "@ToGo"}
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex items-center text-sm  text-gray-700 gap-1">
            <ElapsedTime createdAt={createdAt} />
          </div>
        </div>
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
      {isCanDelete ? (
        <div className="space-y-1 " >
          <div className="w-full flex justify-end opacity-50">
            {!isShowDeleteButton ? (
              <FaEdit
                onClick={() => setIsShowDeleteButton(!isShowDeleteButton)}
                size={20}
              />
            ) : (
              <IoMdCloseCircle
                onClick={() => setIsShowDeleteButton(!isShowDeleteButton)}
                size={24}
              />
            )}
          </div>
          {isShowDeleteButton ? (
            <div className="flex items-center gap-2 ">
              <button
                className={`px-4 py-2 text-sm font-bold text-white rounded-sm   w-full cursor-pointer w-full ${
                  status === "PENDING" ? "bg-[#0C60DC]" : "bg-[#DC0C0F]"
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  {/* <FaCheckCircle /> */}
                  <div>Edit</div>
                </div>
              </button>
              <button
                className={`px-4 py-2 text-sm font-bold text-white rounded-sm   w-full cursor-pointer w-full bg-[#DC0C0F]`}
              >
                <div
                  className="flex items-center gap-2 justify-center"
                  onClick={() => onDelete(id)}
                >
                  {/* <FaCheckCircle /> */}
                  <div>Delete</div>
                </div>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OrderCard;
