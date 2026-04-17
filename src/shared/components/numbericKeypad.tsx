/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useLoading } from "@/shared/hooks/useLoading";
import { cn } from "@/shared/utils/cn";

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
                key === "clear" || key === "backspace" ? "secondary" : "primary"
              }
              className={cn(
                "p-6 text-title font-[var(--weight-bold)]",
                key === "clear"
                  ? "bg-warning-bg hover:opacity-80 text-warning border border-border"
                  : key === "backspace"
                  ? "bg-danger-bg hover:opacity-80 text-danger border border-border"
                  : "bg-bg hover:bg-surface-hover text-text-primary border border-border"
              )}
              onClick={() => handleKeyPress(key)}
            >
              {key === "backspace" ? "⌫" : key === "clear" ? "C" : key}
            </Button>
          ))
        )}
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={() => {
          onSubmit(), onChange("");
        }}
        className="w-full text-title font-[var(--weight-bold)] py-4 px-8 h-auto"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Order"}
      </Button>
    </div>
  );
}
