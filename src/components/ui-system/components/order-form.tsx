"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { NumericKeypad } from "./numbericKeypad";

interface OrderFormProps {
  orderType: "TOGO" | "DINEIN";
  label: string;
  buttonColor: string;
  _onSubmit: ({
    orderType,
    orderNumber,
  }: {
    orderType: string;
    orderNumber: string;
  }) => void;
}

export function OrderForm({ label, _onSubmit, orderType }: OrderFormProps) {
  const [number, setNumber] = useState("");

  const handleSubmit = () => {
    _onSubmit({
      orderType: orderType,
      orderNumber: number,
    });
    setNumber("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  useEffect(() => {
    if (orderType) {
      console.log(orderType);
    }
  }, []);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex flex-col space-y-3">
        <label htmlFor="orderNumber" className="text-2xl font-medium">
          {label}
        </label>
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
