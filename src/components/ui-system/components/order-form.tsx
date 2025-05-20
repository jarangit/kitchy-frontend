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
    tableNumber,
    isWaitingInStore,
  }: {
    orderType: string;
    orderNumber: string;
    tableNumber?: string;
    isWaitingInStore: boolean;
  }) => void;
}

export function OrderForm({ label, _onSubmit, orderType }: OrderFormProps) {
  const [number, setNumber] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isWaitingInStore, setIsWaitingInStore] = useState(false);
  const [focusInput, setFocusInput] = useState<"number" | "tableNumber">(
    "number"
  );

  const handleSubmit = () => {
    _onSubmit({
      orderType: orderType,
      orderNumber: number,
      tableNumber: tableNumber,
      isWaitingInStore: isWaitingInStore,
    });
    setNumber("");
    setIsWaitingInStore(false);
    setTableNumber("");
    setFocusInput("number");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onTapToggleIsWaiting = (value: boolean) => {
    setIsWaitingInStore(value);
    if (value) {
      setFocusInput("tableNumber");
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
          {orderType == "TOGO" ? (
            <>
              <div className="border flex items-center border-black rounded-lg overflow-hidden cursor-pointer">
                <TabItem
                  title={"Just ToGo"}
                  className="w-full rounded-none !p-3"
                  active={!isWaitingInStore}
                  onClick={() => onTapToggleIsWaiting(false)}
                />
                <TabItem
                  title={"@Table"}
                  className="w-full rounded-none !p-3"
                  active={isWaitingInStore}
                  onClick={() => onTapToggleIsWaiting(true)}
                />
              </div>
              {isWaitingInStore ? (
                <Input
                  title="Table Number"
                  value={tableNumber}
                  placeholder="Enter number"
                  onChange={(e) => setTableNumber(e.target.value)}
                  onFocus={() => setFocusInput("tableNumber")}
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
            value={focusInput === "number" ? number : tableNumber}
            onChange={focusInput === "number" ? setNumber : setTableNumber}
            onSubmit={handleSubmit}
            maxLength={4}
          />
        </div>
      </div>
    </form>
  );
}
