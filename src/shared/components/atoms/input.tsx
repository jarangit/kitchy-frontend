import { Button } from "@/shared/components/ui/button";
import { LuKeyboard } from "react-icons/lu";
import React, { useRef, useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
};
const Input: React.FC<InputProps> = ({ title, ...props }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div>
      {title && (
        <label className="block mb-1 text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)]">
          {title}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          ref={inputRef}
          type="text"
          readOnly={!showKeyboard}
          className="w-full border-[var(--input-border)] text-subtitle px-4 py-2 h-auto border rounded-md bg-[var(--input-bg)] transition focus:outline-none focus:border-[var(--input-border-focus)]"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={toggleKeyboard}
          aria-label={showKeyboard ? "Show numeric keypad" : "Show keyboard"}
        >
          <LuKeyboard className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Input;
