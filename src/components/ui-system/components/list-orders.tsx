/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderCard from "./order-card";
import { deleteOrder } from "../../../service/order-service";
import { GoDotFill } from "react-icons/go";
import { useAppDispatch } from "../../../hooks/hooks";
import { openModal } from "../../../store/slices/modal-slice";
import { useLoading } from "../../../hooks/useLoading";
import { useEffect, useState } from "react";

type Props = {
  orders: any[];
};

export const ListOrders = ({ orders }: Props) => {
  const { isLoading } = useLoading(); // ✅ เรียก Hook มาใช้
  const [orderCount, setOrderCount] = useState({
    total: 0,
    togo: 0,
    dineIn: 0,
  });
  const dispatch = useAppDispatch();
  const handleDelete = async (id: number) => {
    dispatch(
      openModal({
        title: "Confirm Delete",
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

  const onGetCountByType = () => {
    setOrderCount({
      total: orders.length,
      togo: orders.filter((i) => i.type == "TOGO").length,
      dineIn: orders.filter((i) => i.type == "DINEIN").length,
    });
  };

  useEffect(() => {
    onGetCountByType();
    console.log(orderCount);
  }, [orders]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-medium">
          Orders <span>({orders?.length})</span>
        </h2>
        <div className="flex gap-2 font-semibold">
          <div className="flex  items-center">
            <GoDotFill size={25} color="#34C759" />
            <div>Dine in ({orderCount.dineIn})</div>
          </div>
          <div className="flex  items-center">
            <GoDotFill size={25} color="#FF6B6B" />
            <div>To-go ({orderCount.togo})</div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-[#E4E4E4] rounded-lg flex-col p-3">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {orders?.length && !isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4  2xl:grid-cols-6 gap-3">
                {orders.map((order, key) => (
                  <div key={key}>
                    <OrderCard
                      order={order}
                      onDelete={() => handleDelete(order.id)}
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
