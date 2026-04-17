import { useEffect, useRef, useState } from "react";
import {
  LuCircleCheck,
  LuPencil,
  LuRepeat,
  LuX,
  LuClock,
} from "react-icons/lu";
import ElapsedTime from "@/shared/components/elapsed-time";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
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
  const { t } = useTranslation();
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

  const highlightWaiting = !isToGo && isWaitingInStore;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between gap-3",
        "rounded-card border border-card-border bg-card-bg p-card-padding",
        "transition-opacity duration-300",
        highlightWaiting && "border-warning/30 bg-warning-bg/40",
        isFading ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-title font-[var(--weight-semibold)] text-text-primary md:text-display">
            #{orderNumber}
          </div>
          <div className="flex items-center gap-1 text-label text-text-secondary md:hidden">
            <LuClock size={14} />
            <ElapsedTime createdAt={createdAtStr} />
          </div>
        </div>

        {previousOrderNumber && (
          <p className="text-body-sm text-text-secondary">
            {t("order.previousOrderUpdated", {
              previous: previousOrderNumber,
              current: orderNumber,
            })}
          </p>
        )}

        <div className="hidden flex-col flex-wrap gap-3 md:flex">
          <div className="flex flex-wrap gap-2">
            <Badge variant={isToGo ? "info" : "default"} size="lg">
              {isToGo ? t("order.label.togo") : t("order.label.dineIn")}
            </Badge>

            {isWaitingInStore && (
              <Badge variant="warning" size="lg">
                {isToGo
                  ? t("order.label.waitInStoreTogo")
                  : t("order.label.waitInStoreDineIn")}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 text-label text-text-secondary">
            <LuClock size={14} />
            <ElapsedTime createdAt={createdAtStr} />
          </div>
        </div>
      </div>

      {isCanAction && (
        <Button
          variant={isOpenStatus ? "primary" : "secondary"}
          className="w-full"
          onClick={handleUpdate}
        >
          {isOpenStatus ? (
            <span className="flex items-center justify-center gap-2">
              <LuCircleCheck size={18} />
              <span>{t("order.status.makeDone")}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LuRepeat size={18} />
              <span>{t("order.status.makePending")}</span>
            </span>
          )}
        </Button>
      )}

      {isCanDelete && (
        <div className="space-y-2">
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={() => setIsShowDeleteButton(!isShowDeleteButton)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              aria-label={isShowDeleteButton ? t("common.cancel") : t("common.edit")}
            >
              {isShowDeleteButton ? <LuX size={18} /> : <LuPencil size={16} />}
            </button>
          </div>
          {isShowDeleteButton && (
            <div className="flex items-center gap-2" ref={actionRef}>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => onEditOrder(id)}
              >
                {t("common.edit")}
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => onDelete(id)}
              >
                {t("common.delete")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
