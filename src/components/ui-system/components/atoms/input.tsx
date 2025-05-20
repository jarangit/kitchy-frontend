import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import React, { useRef, useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="relative mb-4">
      <input
        {...props}
        ref={inputRef}
        type="text"
        readOnly={!showKeyboard}
        className="w-full text-lg px-4 py-2 h-auto border rounded-md bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
};

export default Input;