/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderCard from "./order-card";
import { deleteOrder, updateOrderStatus } from "../../../service/order-service";
import { GoDotFill } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { closeModal, openModal } from "../../../store/slices/modal-slice";
import { useLoading } from "../../../hooks/useLoading";
import TabOrder from "./tab-order";
import {
  setSelectedType,
  setSelectedStatus,
} from "../../../store/slices/order-slice";
import { useEffect, useRef, useState } from "react";
import type { IOrderItem, IUpdateOrder } from "@/service/type";
import EditModal from "./ORG/modals/edit-modal";
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

  // ฟังก์ชัน filter order ตาม type และ status
  let filteredOrders = orders.filter((order) => {
    const typeMatch =
      selectedType === "ALL" ? true : order.type === selectedType;
    const statusMatch =
      selectedStatus === "ALL" ? true : order.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  // ถ้าเลือก tab COMPLETED ให้เรียง createdAt จากน้อยไปมาก
  if (selectedStatus === "COMPLETED" || sort == "DESC") {
    filteredOrders = [...filteredOrders].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  const handleDelete = async (id: number) => {
    dispatch(
      openModal({
        title: "Confirm Delete",
        template: "DELETE",
        content: "Are you sure you want to delete this?",
        onConfirm: async () => await onDeleteOrder(id),
      })
    );
  };

  const onDeleteOrder = async (id: number) => {
    try {
      await deleteOrder(id);
    } catch (error) {
      console.log(error);
    }
  };

  // เมื่อเลือก tab ให้ dispatch ไปที่ store
  const handleTabClick = (
    typeOrStatus: "PENDING" | "TOGO" | "DINEIN" | "COMPLETED" | "ALL"
  ) => {
    if (
      typeOrStatus === "TOGO" ||
      typeOrStatus === "DINEIN" ||
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
      await updateOrderStatus(data);
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
      await updateOrderStatus(data);
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
              <GoDotFill size={25} color="#9747FF" />
              <div>Dine in @ToGo</div>
            </div>
          ) : (
            ""
          )}
          <div className="flex items-center">
            <GoDotFill size={25} color="#34C759" />
            <div>Dine in</div>
          </div>
          <div className="flex items-center">
            <GoDotFill size={25} color="#FF6B6B" />
            <div>To-go</div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className={`bg-[#E4E4E4] rounded-lg flex-col p-3 h-full flex-grow overflow-y-auto`}
      >
        {isLoading && !filteredOrders?.length ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {filteredOrders.length ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-3   2xl:grid-cols-4 gap-3  ${
                  containerRef.current && containerRef.current.offsetWidth > 950
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3"
                }`}
              >
                {filteredOrders.map((order: any, key: any) => (
                  <div key={key}>
                    <OrderCard
                      order={order}
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
              <div className="text-center text-gray-500">
                There are currently no orders
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
