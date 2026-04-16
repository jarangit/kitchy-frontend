/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderCard from "./order-card";
import { orderApiService } from "@/features/order/services/order";
import { GoDotFill } from "react-icons/go";
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
import type { IUpdateOrder, OrderStatus } from "@/features/order/types/order.dto";
import EditModal from "@/shared/components/modals/edit-modal";
import { cn } from "@/shared/utils/cn";
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
  const { isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const [isHaveDineInWithToGoOrder, setIsHaveDineInWithToGoOrder] =
    useState(false);

  // ดึงข้อมูลจาก store
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

  // ฟังก์ชัน filter order ตาม type และ status
  let filteredOrders = orders.filter((order) => {
    const normalizedType = normalizeType(order.type);
    const normalizedStatus = normalizeStatus(order.status);
    const typeMatch = selectedType === "ALL" ? true : normalizedType === selectedType;
    const statusMatch = selectedStatus === "ALL" ? true : normalizedStatus === selectedStatus;
    return typeMatch && statusMatch;
  });

  // ถ้าเลือก tab COMPLETED ให้เรียง createdAt จากน้อยไปมาก
  if (selectedStatus === "COMPLETED" || sort == "DESC") {
    filteredOrders = [...filteredOrders].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  const handleDelete = async (id: string) => {
    dispatch(
      openModal({
        title: "Confirm Delete",
        template: "DELETE",
        content: "Are you sure you want to delete this?",
        onConfirm: async () => await onDeleteOrder(id),
      })
    );
  };

  const onDeleteOrder = async (id: string) => {
    try {
      await orderApiService.delete(id);
    } catch (error) {
      console.error(error);
    }
  };

  // เมื่อเลือก tab ให้ dispatch ไปที่ store
  const handleTabClick = (
    typeOrStatus: "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED" | "ALL"
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

  // function for update order status
  const handleUpdateOrderStatus = async (data: IUpdateOrder) => {
    try {
      await orderApiService.update(data.id, data);
    } catch (error: any) {
      dispatch(
        openModal({
          title: "",
          content: ``,
          template: "ERROR",
        })
      );
    }
  };

  const handleEditOrder = (order: IOrderItem) => {
    dispatch(
      openModal({
        title: "Edit Order",
        template: "EDIT",
        content: "",
        component: <EditModal data={order} _onSubmit={(e) => onUpdate(e)} />,
        onConfirm: () => {},
      })
    );
  };

  const onUpdate = async (data: IUpdateOrder) => {
    try {
      await orderApiService.update(data.id, data);
    } catch (error: any) {
      dispatch(
        openModal({
          title: "",
          content: ``,
          template: "ERROR",
        })
      );
    } finally {
      // Close the modal after updating
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    const found = orders.some(
      (order) => (order as unknown as IOrderItem).isWaitingInStore
    );
    setIsHaveDineInWithToGoOrder(found);
  }, [orders]);

  return (
    <div className=" flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-6">
        <TabOrder _onClickTabItem={handleTabClick} />
        <div className="flex gap-2 font-semibold">
          {isHaveDineInWithToGoOrder ? (
            <div className="flex items-center">
              <GoDotFill size={25} style={{ color: 'var(--color-info)' }} />
              <div>Dine in @ToGo</div>
            </div>
          ) : (
            ""
          )}
          <div className="flex items-center">
            <GoDotFill size={25} style={{ color: 'var(--color-success)' }} />
            <div>Dine in</div>
          </div>
          <div className="flex items-center">
            <GoDotFill size={25} style={{ color: 'var(--color-danger)' }} />
            <div>To-go</div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className={cn("bg-[var(--color-surface)] rounded-lg flex-col p-3 h-full flex-grow overflow-y-auto")}
      >
        {isLoading && !filteredOrders?.length ? (
          <div className="text-center text-[var(--color-text-secondary)]">Loading...</div>
        ) : (
          <>
            {filteredOrders.length ? (
              <div
                className={cn(
                  "grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-3",
                  containerRef.current && containerRef.current.offsetWidth > 950
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3"
                )}
              >
                 {filteredOrders.map((order: any, key: any) => (
                   <div key={key}>
                     <OrderCard
                       order={{
                         ...order,
                         type: normalizeType(order.type),
                         status: normalizeStatus(order.status),
                       }}
                       onDelete={() => handleDelete(order.id)}
                      onUpdateStatus={(data: IUpdateOrder) =>
                        handleUpdateOrderStatus(data)
                      }
                      onEditOrder={() => handleEditOrder(order)}
                      isCanDelete={isCanDelete}
                      isCanAction={isCanUpdate}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[var(--color-text-secondary)]">
                There are currently no orders
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
