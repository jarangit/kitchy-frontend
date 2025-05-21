"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { NumericKeypad } from "./numbericKeypad";
import Input from "./atoms/input";
import TabItem from "./atoms/tab-item";

interface OrderFormProps {
  orderType: "TOGO" | "DINEIN";
  label: string;
  buttonColor: string;
  _onSubmit: ({
    orderType,
    orderNumber,
    waitingOrderNumber,
    isWaitingInStore,
  }: {
    orderType: string;
    orderNumber: string;
    waitingOrderNumber?: string;
    isWaitingInStore: boolean;
  }) => void;
}

export function OrderForm({ label, _onSubmit, orderType }: OrderFormProps) {
  const [number, setNumber] = useState("");
  const [waitingOrderNumber, setWaitingOrderNumber] = useState("");
  const [isWaitingInStore, setIsWaitingInStore] = useState(false);
  const [focusInput, setFocusInput] = useState<"number" | "waitingOrderNumber">(
    "number"
  );

  const handleSubmit = () => {
    _onSubmit({
      orderType: orderType,
      orderNumber: number,
      waitingOrderNumber: waitingOrderNumber,
      isWaitingInStore: isWaitingInStore,
    });
    setNumber("");
    setIsWaitingInStore(false);
    setWaitingOrderNumber("");
    setFocusInput("number");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onTapToggleIsWaiting = (value: boolean) => {
    setIsWaitingInStore(value);
    if (value) {
      setFocusInput("waitingOrderNumber");
    } else {
      setFocusInput("number");
    }
  };

  useEffect(() => {
    if (orderType) {
      console.log(orderType);
    }
  }, []);

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
          onFocus={() => setFocusInput("number")}
        />
        {/* waiting */}
        <div
          className={`p-0 transition-all ${
            isWaitingInStore && "p-3 bg-gray-200 space-y-2 rounded-lg"
          }`}
        >
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
              {isWaitingInStore ? (
                <Input
                  title="Table Number"
                  value={waitingOrderNumber}
                  placeholder="Enter number"
                  onChange={(e) => setWaitingOrderNumber(e.target.value)}
                  onFocus={() => setFocusInput("waitingOrderNumber")}
                />
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <NumericKeypad
            value={focusInput === "number" ? number : waitingOrderNumber}
            onChange={
              focusInput === "number" ? setNumber : setWaitingOrderNumber
            }
            onSubmit={handleSubmit}
            maxLength={4}
          />
        </div>
      </div>
    </form>
  );
}
