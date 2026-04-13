// TODO: card dine in @ToGo add yellow badge text is "Table"
// TODO: add badge for ToGo waiting in store text is "Waiting"
// TODO: show edit and delete button when isCanAction is true
// TODO: open popup when click edit button
// TODO: affter edited show old value and new value and some animation for tell user edit is success
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { IoIosRepeat, IoMdCloseCircle } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ElapsedTime from "@/shared/components/elapsed-time";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { IUpdateOrder } from "@/features/order/types/order.dto";

interface Props {
  order: IOrderItem;
  onDelete: (id: number) => void;
  onUpdateStatus: (data: IUpdateOrder) => void;
  onEditOrder: (id: number) => void;
  isCanDelete?: boolean;
  isCanAction?: boolean;
}

const OrderCard = ({
  order,
  onDelete,
  onUpdateStatus,
  onEditOrder,
  isCanDelete,
  isCanAction,
}: Props) => {
  const {
    id,
    orderNumber,
    type,
    createdAt,
    status,
    isWaitingInStore,
    previousOrderNumber,
  } = order;
  const [isFading, setIsFading] = useState(false);
  const isToGo = type === "TOGO";
  const [isShowDeleteButton, setIsShowDeleteButton] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  // แปลงวันที่เป็น timezone ของ user
  // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const createdAtZoned = toZonedTime(new Date(createdAt), userTimeZone);
  // const formattedCreatedAt = format(createdAtZoned, "dd/MM/yy HH:mm");
  const handleUpdate = () => {
    const payload: IUpdateOrder = {
      id,
      status: status == "PENDING" ? "COMPLETED" : "PENDING",
    };
    setIsFading(true);
    setTimeout(() => {
      onUpdateStatus(payload);
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

  useEffect(() => {
    // เมื่อ component ถูก mount ให้ reset isShowDeleteButton
    setIsShowDeleteButton(false);
    return () => {
      // เมื่อ component ถูก unmount ให้ reset isShowDeleteButton
      setIsShowDeleteButton(false);
    };
  }, [order]);

  return (
    <div
      className={`w-full h-full rounded-xl p-4  relative  transition-opacity duration-300 flex flex-col justify-between gap-3 ${
        isToGo ? "bg-[var(--color-danger-bg)]" : "bg-[var(--color-success-bg)]"
      }
      ${!isToGo && isWaitingInStore && "!bg-[var(--color-info-bg)]"}
      ${isFading ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="md:text-4xl font-bold">#{orderNumber}</div>
          <div className="flex md:hidden items-center text-sm text-[var(--color-text-secondary)]">
            <FaClock className="mr-1" />
            <ElapsedTime
              createdAt={
                typeof createdAt === "string"
                  ? createdAt
                  : createdAt.toISOString()
              }
            />
          </div>
        </div>
        {previousOrderNumber && (
          <div className=" font-bold text-lg ">
            Updated: #{previousOrderNumber} to <span className="underline">#{orderNumber}</span>
          </div>
        )}
        <div className="hidden md:flex justify-between flex-wrap gap-3 flex-col">
          <div className="flex flex-wrap gap-2">
            <div
              className={` inline-block px-3 py-1 text-[var(--color-text-primary)] font-bold text-lg rounded-full min-w-[60px] text-center ${
                isToGo ? "bg-[var(--color-danger)]" : "bg-[var(--color-success)]"
              }`}
            >
              {isToGo ? "ToGo" : "Dine-in"}
            </div>

            {isWaitingInStore ? (
              <div
                className={` inline-block px-3 py-1 text-[var(--color-text-primary)] font-bold text-lg rounded-full min-w-[60px] text-center bg-[var(--color-warning)]`}
              >
                {isToGo ? "@Wait" : "@ToGo"}
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex items-center text-sm  text-[var(--color-text-secondary)] gap-1">
            <ElapsedTime
              createdAt={
                typeof createdAt === "string"
                  ? createdAt
                  : createdAt.toISOString()
              }
            />
          </div>
        </div>
      </div>
      {/* button update status */}
      {isCanAction ? (
        <button
          className={`px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] rounded-lg h-11 w-full cursor-pointer active:scale-[0.98] transition-all duration-[var(--motion-fast)] ${
            status === "PENDING" ? "bg-[var(--color-info)]" : "bg-[var(--color-danger-hover)]"
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
        <div className="space-y-1 ">
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
                className={`px-4 py-2 text-sm font-bold text-[var(--color-text-inverse)] rounded-sm h-11 w-full cursor-pointer bg-[var(--color-info)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]`}
                onClick={() => onEditOrder(id)}
              >
                <div className="flex items-center gap-2 justify-center">
                  {/* <FaCheckCircle /> */}
                  <div>Edit</div>
                </div>
              </button>
              <button
                className={`px-4 py-2 text-sm font-bold text-[var(--color-text-inverse)] rounded-sm h-11 w-full cursor-pointer bg-[var(--color-danger)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]`}
              >
                <div
                  className="flex items-center gap-2 justify-center"
                  onClick={() => {
                    onDelete(id);
                  }}
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
