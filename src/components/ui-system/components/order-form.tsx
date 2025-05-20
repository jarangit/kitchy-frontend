"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { NumericKeypad } from "./numbericKeypad";
import Input from "./atoms/input";

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
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onTapToggleIsWaiting = () => {
    setIsWaitingInStore(!isWaitingInStore);
    setFocusInput("tableNumber");
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
      <div className="flex flex-col space-y-2">
        <label htmlFor="orderNumber" className="text-xl font-medium">
          {label}
        </label>
        <Input
          value={number}
          placeholder="Enter number"
          onChange={(e) => setNumber(e.target.value)}
          onFocus={() => setFocusInput("number")}
        />
        {orderType == "TOGO" ? (
          <>
            <label htmlFor="waiting">
              <input
                type="checkbox"
                placeholder="is waiting"
                id="waiting"
                onChange={() => onTapToggleIsWaiting()}
              />
              Waiting
            </label>
            {isWaitingInStore ? (
              <Input
                value={tableNumber}
                placeholder="Enter Table number"
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
