import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { IoIosRepeat, IoMdCloseCircle } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ElapsedTime from "@/shared/components/elapsed-time";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { IUpdateOrder } from "@/features/order/types/order.dto";

interface Props {
  order: IOrderItem;
  onDelete: (id: string) => void;
  onUpdateStatus: (data: IUpdateOrder) => void;
  onEditOrder: (id: string) => void;
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
  const isOpenStatus =
    status === "PENDING" || status === "NEW" || status === "PREPARING";

  const handleUpdate = () => {
    const payload: IUpdateOrder = {
      id,
      status: isOpenStatus ? "READY" : "NEW",
    };
    setIsFading(true);
    setTimeout(() => {
      onUpdateStatus(payload);
      setIsFading(false);
    }, 300);
  };

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
    setIsShowDeleteButton(false);
    return () => {
      setIsShowDeleteButton(false);
    };
  }, [order]);

  const createdAtStr =
    typeof createdAt === "string" ? createdAt : createdAt.toISOString();

  return (
    <div
      className={cn(
        "w-full h-full rounded-radius-md p-4 relative",
        "transition-opacity duration-300 flex flex-col justify-between gap-3",
        "bg-[var(--color-surface)]",
        !isToGo && isWaitingInStore && "!bg-[var(--color-warning-bg)]",
        isFading ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="md:text-display font-[var(--weight-bold)]">#{orderNumber}</div>
          <div className="flex md:hidden items-center text-label text-[var(--color-text-secondary)]">
            <FaClock className="mr-1" />
            <ElapsedTime createdAt={createdAtStr} />
          </div>
        </div>
        {previousOrderNumber && (
          <div className="font-[var(--weight-bold)] text-subtitle">
            Updated: #{previousOrderNumber} to{" "}
            <span className="underline">#{orderNumber}</span>
          </div>
        )}
        <div className="hidden md:flex justify-between flex-wrap gap-3 flex-col">
          <div className="flex flex-wrap gap-2">
            <Badge variant={isToGo ? "info" : "default"} size="lg">
              {isToGo ? "ToGo" : "Dine-in"}
            </Badge>

            {isWaitingInStore && (
              <Badge variant="warning" size="lg">
                {isToGo ? "@Wait" : "@ToGo"}
              </Badge>
            )}
          </div>

          <div className="flex items-center text-label text-[var(--color-text-secondary)] gap-1">
            <ElapsedTime createdAt={createdAtStr} />
          </div>
        </div>
      </div>

      {isCanAction && (
        <Button
          variant={isOpenStatus ? "primary" : "secondary"}
          className={cn(
            "w-full",
            isOpenStatus && "bg-[var(--color-success)] hover:bg-[var(--color-success)]",
            !isOpenStatus && "bg-[var(--color-warning)] text-[var(--color-text-primary)] hover:bg-[var(--color-warning)]",
          )}
          onClick={handleUpdate}
        >
          {isOpenStatus ? (
            <span className="flex items-center gap-2 justify-center">
              <FaCheckCircle />
              <span>Make A Done</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              <IoIosRepeat size={25} />
              <span>Make A Pending</span>
            </span>
          )}
        </Button>
      )}

      {isCanDelete && (
        <div className="space-y-1">
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
          {isShowDeleteButton && (
            <div className="flex items-center gap-2" ref={actionRef}>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => onEditOrder(id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => onDelete(id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
