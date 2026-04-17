import OrderCard from "./order-card";
import { orderApiService } from "@/features/order/services/order";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { closeModal, openModal } from "@/shared/store/slices/modal-slice";
import { useLoading } from "@/shared/hooks/useLoading";
import TabOrder from "@/shared/components/tab-order";
import {
  setSelectedType,
  setSelectedStatus,
} from "@/shared/store/slices/order-slice";
import { useEffect, useRef, useState } from "react";
import type { IOrderItem } from "@/features/order/types/order.model";
import type {
  IUpdateOrder,
  OrderStatus,
} from "@/features/order/types/order.dto";
import EditModal from "@/shared/components/modals/edit-modal";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { LuInbox } from "react-icons/lu";

type Props = {
  isCanDelete?: boolean;
  isCanUpdate?: boolean;
  sort?: "DESC" | "ASC";
};

export const ListOrders = ({
  isCanDelete,
  isCanUpdate,
  sort = "ASC",
}: Props) => {
  const { t } = useTranslation();
  const { isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const [isHaveDineInWithToGoOrder, setIsHaveDineInWithToGoOrder] =
    useState(false);

  const orders = useAppSelector((state) => state.orders.orders);
  const selectedType = useAppSelector((state) => state.orders.selectedType);
  const selectedStatus = useAppSelector((state) => state.orders.selectedStatus);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizeType = (type: string) => {
    if (type === "DINEIN") return "DINE_IN";
    return type;
  };

  const normalizeStatus = (status: string): OrderStatus => {
    if (status === "NEW" || status === "PREPARING") return "PENDING";
    if (status === "READY") return "COMPLETED";
    return status as OrderStatus;
  };

  let filteredOrders = orders.filter((order) => {
    const normalizedType = normalizeType(order.type);
    const normalizedStatus = normalizeStatus(order.status);
    const typeMatch =
      selectedType === "ALL" ? true : normalizedType === selectedType;
    const statusMatch =
      selectedStatus === "ALL" ? true : normalizedStatus === selectedStatus;
    return typeMatch && statusMatch;
  });

  if (selectedStatus === "COMPLETED" || sort == "DESC") {
    filteredOrders = [...filteredOrders].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  const handleDelete = async (id: string) => {
    dispatch(
      openModal({
        title: t("order.delete.title"),
        template: "DELETE",
        content: t("order.delete.description"),
        onConfirm: async () => await onDeleteOrder(id),
      }),
    );
  };

  const onDeleteOrder = async (id: string) => {
    try {
      await orderApiService.delete(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabClick = (
    typeOrStatus: "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED" | "ALL",
  ) => {
    if (
      typeOrStatus === "TOGO" ||
      typeOrStatus === "DINE_IN" ||
      typeOrStatus === "ALL"
    ) {
      dispatch(setSelectedType(typeOrStatus));
      dispatch(setSelectedStatus("PENDING"));
    } else if (typeOrStatus === "PENDING" || typeOrStatus === "COMPLETED") {
      dispatch(setSelectedType("ALL"));
      dispatch(setSelectedStatus(typeOrStatus));
    }
  };

  const handleUpdateOrderStatus = async (data: IUpdateOrder) => {
    try {
      await orderApiService.update(data.id, data);
    } catch {
      dispatch(
        openModal({
          title: "",
          content: "",
          template: "ERROR",
        }),
      );
    }
  };

  const handleEditOrder = (order: IOrderItem) => {
    dispatch(
      openModal({
        title: t("order.edit.title"),
        template: "EDIT",
        content: "",
        component: <EditModal data={order} _onSubmit={(e) => onUpdate(e)} />,
        onConfirm: () => {},
      }),
    );
  };

  const onUpdate = async (data: IUpdateOrder) => {
    try {
      await orderApiService.update(data.id, data);
    } catch {
      dispatch(
        openModal({
          title: "",
          content: "",
          template: "ERROR",
        }),
      );
    } finally {
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    const found = orders.some(
      (order) => (order as unknown as IOrderItem).isWaitingInStore,
    );
    setIsHaveDineInWithToGoOrder(found);
  }, [orders]);

  return (
    <div className="flex flex-grow flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-6">
        <TabOrder _onClickTabItem={handleTabClick} />
        <div className="flex flex-wrap gap-2">
          {isHaveDineInWithToGoOrder && (
            <Badge variant="info">{t("order.legend.dineInWaiting")}</Badge>
          )}
          <Badge variant="success">{t("order.legend.dineIn")}</Badge>
          <Badge variant="danger">{t("order.legend.togo")}</Badge>
        </div>
      </div>
      <div
        ref={containerRef}
        className={cn(
          "flex h-full flex-grow flex-col overflow-y-auto rounded-card border border-card-border bg-card-bg p-card-padding",
        )}
      >
        {isLoading && !filteredOrders?.length ? (
          <div className="text-center text-text-secondary">
            {t("common.loading")}
          </div>
        ) : filteredOrders.length ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-3 md:grid-cols-3 2xl:grid-cols-4",
              containerRef.current && containerRef.current.offsetWidth > 950
                ? "md:grid-cols-4"
                : "md:grid-cols-3",
            )}
          >
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={{
                  ...(order as unknown as IOrderItem),
                  type: normalizeType(order.type) as IOrderItem["type"],
                  status: normalizeStatus(order.status) as IOrderItem["status"],
                }}
                onDelete={() => handleDelete(order.id)}
                onUpdateStatus={(data: IUpdateOrder) =>
                  handleUpdateOrderStatus(data)
                }
                onEditOrder={() =>
                  handleEditOrder(order as unknown as IOrderItem)
                }
                isCanDelete={isCanDelete}
                isCanAction={isCanUpdate}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<LuInbox size={32} />}
            title={t("order.empty")}
          />
        )}
      </div>
    </div>
  );
};
