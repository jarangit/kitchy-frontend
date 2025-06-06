/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { useLoading } from "@/hooks/useLoading";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
}

export function NumericKeypad({
  onChange,
  onSubmit,
  maxLength = 10,
  value,
}: NumericKeypadProps) {
  const [numberValue, setNumberValue] = useState("");
  const {isLoading}= useLoading()

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      onChange(numberValue.slice(0, -1));
      setNumberValue(numberValue.slice(0, -1));
    } else if (key === "clear") {
      onChange("");
      setNumberValue("");
    } else if (numberValue.length < maxLength) {
      onChange(numberValue + key);
      setNumberValue(numberValue + key);
    }
  };

  // Numeric keypad layout
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["clear", "0", "backspace"],
  ];

  useEffect(() => {
    setNumberValue(value);
  }, [value]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {keys.map((row, rowIndex) =>
          row.map((key, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              variant={
                key === "clear" || key === "backspace" ? "outline" : "default"
              }
              className={`p-6 text-xl font-bold ${
                key === "clear"
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300"
                  : key === "backspace"
                  ? "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
                  : "bg-white hover:bg-gray-200 text-black border border-black"
              }`}
              onClick={() => handleKeyPress(key)}
            >
              {key === "backspace" ? "⌫" : key === "clear" ? "C" : key}
            </Button>
          ))
        )}
      </div>

      <Button
        type="button"
        onClick={() => {
          onSubmit(), onChange("");
        }}
        className="w-full bg-black text-white hover:bg-gray-700 text-xl font-bold py-4 px-8 h-auto"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Order"}
      </Button>
    </div>
  );
}
