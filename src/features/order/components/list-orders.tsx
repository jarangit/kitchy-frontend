import OrderCard from "./order-card";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { closeModal, openModal } from "@/shared/store/slices/modal-slice";
import TabOrder from "@/shared/components/tab-order";
import {
  setSelectedType,
  setSelectedStatus,
} from "@/shared/store/slices/order-slice";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { IUpdateOrder } from "@/features/order/types/order.dto";
import { useOrderService } from "@/features/order/hooks/useOrder";
import {
  normalizeType,
  normalizeStatus,
} from "@/features/order/utils/order-normalizer";
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
  const dispatch = useAppDispatch();
  const [isHaveDineInWithToGoOrder, setIsHaveDineInWithToGoOrder] =
    useState(false);

  const {
    ordersQuery: orders,
    isLoading,
    deleteMutation,
    updateMutation,
  } = useOrderService({});
  const selectedType = useAppSelector((state) => state.orders.selectedType);
  const selectedStatus = useAppSelector((state) => state.orders.selectedStatus);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOrders = useMemo(() => {
    const list = (orders as IOrderItem[]).filter((order) => {
      const normalizedType = normalizeType(order.type);
      const normalizedStatus = normalizeStatus(order.status);
      const typeMatch =
        selectedType === "ALL" ? true : normalizedType === selectedType;
      const statusMatch =
        selectedStatus === "ALL" ? true : normalizedStatus === selectedStatus;
      return typeMatch && statusMatch;
    });

    if (selectedStatus === "COMPLETED" || sort === "DESC") {
      return [...list].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }

    return list;
  }, [orders, selectedType, selectedStatus, sort]);

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
      await deleteMutation.mutateAsync(id);
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
      await updateMutation.mutateAsync({ orderId: data.id, orderData: data });
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
      await updateMutation.mutateAsync({ orderId: data.id, orderData: data });
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
    const found = (orders as IOrderItem[]).some(
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
