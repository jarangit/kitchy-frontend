// TODO: add tab selector for togo order but wait in store or not
// TODO: design for edit mode
import type React from "react";
import { useEffect, useState } from "react";
import { NumericKeypad } from "./numbericKeypad";
import Input from "./atoms/input";
import TabItem from "./atoms/tab-item";
import type { IOrderItem } from "@/service/type";

interface OrderFormProps {
  orderType: "TOGO" | "DINEIN" | "";
  label: string;
  buttonColor: string;
  initValue?: IOrderItem;
  _onSubmit: ({
    orderType,
    orderNumber,
    isWaitingInStore,
  }: {
    orderType: string;
    orderNumber: string;
    isWaitingInStore: boolean;
  }) => void;
}

export function OrderForm({
  label,
  _onSubmit,
  orderType,
  initValue,
}: OrderFormProps) {
  const [number, setNumber] = useState("");
  const [isWaitingInStore, setIsWaitingInStore] = useState(false);

  const handleSubmit = () => {
    _onSubmit({
      orderType: orderType,
      orderNumber: number,
      isWaitingInStore: isWaitingInStore,
    });
    setNumber("");
    setIsWaitingInStore(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onTapToggleIsWaiting = (value: boolean) => {
    setIsWaitingInStore(value);
  };

  const onInitValue = () => {
    if (initValue) {
      setNumber(initValue.orderNumber || "");
      setIsWaitingInStore(initValue.isWaitingInStore || false);
    } else {
      setNumber("");
      setIsWaitingInStore(false);
    }
  };
  useEffect(() => {
    onInitValue();
  }, [initValue]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className=" bg-white p-6 rounded-lg lg:min-w-[300px]"
    >
      <div className="flex flex-col space-y-4">
        <label htmlFor="orderNumber" className="text-xl font-semibold">
          {label}
        </label>
        <Input
          value={number}
          placeholder="Enter number"
          onChange={(e) => setNumber(e.target.value)}
        />
        {/* waiting */}
        {orderType == "DINEIN" ? (
          <>
            <div className="border flex items-center border-black rounded-lg overflow-hidden cursor-pointer">
              <TabItem
                title={"Table"}
                className="w-full rounded-none !p-3"
                active={!isWaitingInStore}
                onClick={() => onTapToggleIsWaiting(false)}
              />
              <TabItem
                title={"@ToGo"}
                className="w-full rounded-none !p-3"
                active={isWaitingInStore}
                onClick={() => onTapToggleIsWaiting(true)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="border flex items-center border-black rounded-lg overflow-hidden cursor-pointer">
              <TabItem
                title={"Pickup"}
                className="w-full rounded-none !p-3"
                active={!isWaitingInStore}
                onClick={() => onTapToggleIsWaiting(false)}
              />
              <TabItem
                title={"@Waiting"}
                className="w-full rounded-none !p-3"
                active={isWaitingInStore}
                onClick={() => onTapToggleIsWaiting(true)}
              />
            </div>
          </>
        )}
        <div className="flex flex-col space-y-4">
          <NumericKeypad
            value={number}
            onChange={setNumber}
            onSubmit={handleSubmit}
            maxLength={4}
          />
        </div>
      </div>
    </form>
  );
}
