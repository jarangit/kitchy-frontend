import type { IOrderItem, IUpdateOrder } from "@/service/type";
import React, { useEffect, useState } from "react";
import { OrderForm } from "../../order-form";
import OrderCard from "../../order-card";

type Props = {
  data: IOrderItem;
  _onSubmit: (data: IUpdateOrder) => void;
};

function EditModal({ data, _onSubmit }: Props) {
  const { type } = data;
  const [order, setOrder] = useState<IOrderItem>();
  const allowedTypes = ["TOGO", "DINEIN", ""] as const;
  const safeType = allowedTypes.includes(type as any)
    ? (type as "" | "TOGO" | "DINEIN")
    : "";

  const onSubmit = (e: any) => {
    const { orderType, orderNumber, isWaitingInStore } = e;
    const payload: IUpdateOrder = {
      id: data.id,
      orderNumber,
      type: orderType,
      isWaitingInStore,
    };
    _onSubmit(payload);
  };

  useEffect(() => {
    setOrder(data);
  }, [data]);

  return (
    <div>
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="h-[180px] w-[280px] m-auto">
            <OrderCard
              order={order}
              onDelete={() => ""}
              onUpdateStatus={() => ""}
              onEditOrder={() => ""}
            />
          </div>
          <OrderForm
            orderType={safeType}
            label={""}
            buttonColor={""}
            initValue={order}
            _onSubmit={(e: any) => onSubmit(e)}
          />
        </div>
      )}
    </div>
  );
}

export default EditModal;
