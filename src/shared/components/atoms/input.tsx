import { Button } from "@/shared/components/ui/button";
import { Input as TextInput } from "@/shared/components/ui/input";
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
        <label className="block mb-1 text-label text-text-secondary">
          {title}
        </label>
      )}
      <div className="relative">
        <TextInput
          {...props}
          ref={inputRef}
          type="text"
          readOnly={!showKeyboard}
          className="h-auto rounded-radius-sm py-2 pr-16 text-subtitle"
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
