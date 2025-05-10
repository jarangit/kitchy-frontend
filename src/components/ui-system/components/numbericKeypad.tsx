"use client"

import { useState } from "react"
import { Keyboard } from "lucide-react"
import { Button } from "../../ui/button"

interface NumericKeypadProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  maxLength?: number
}

export function NumericKeypad({ value, onChange, onSubmit, maxLength = 10 }: NumericKeypadProps) {
  const [showKeyboard, setShowKeyboard] = useState(false)

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      onChange(value.slice(0, -1))
    } else if (key === "clear") {
      onChange("")
    } else if (value.length < maxLength) {
      onChange(value + key)
    }
  }

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard)
  }

  // Numeric keypad layout
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["clear", "0", "backspace"],
  ]

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-lg px-4 py-2 h-auto border rounded-md bg-white ${
            !showKeyboard ? "pointer-events-none" : ""
          }`}
          readOnly={!showKeyboard}
          placeholder="Enter number"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={toggleKeyboard}
          aria-label={showKeyboard ? "Show numeric keypad" : "Show keyboard"}
        >
          <Keyboard className="h-8 w-8" />
        </Button>
      </div>

      {!showKeyboard && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {keys.map((row, rowIndex) =>
            row.map((key, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                variant={key === "clear" || key === "backspace" ? "outline" : "default"}
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
            )),
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        className="w-full bg-black text-white hover:bg-gray-700 text-xl font-bold py-4 px-8 h-auto"
      >
        Add Order
      </Button>
    </div>
  )
}
