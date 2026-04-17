import {
  forwardRef,
  useRef,
  useState,
  type ForwardedRef,
  type InputHTMLAttributes,
  type MutableRefObject,
} from "react";
import { LuKeyboard } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  keyboardToggle?: boolean;
}

function setInputRefs(
  node: HTMLInputElement | null,
  refs: Array<MutableRefObject<HTMLInputElement | null> | ForwardedRef<HTMLInputElement>>,
) {
  refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(node);
      return;
    }
    ref.current = node;
  });
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, keyboardToggle = false, className, readOnly, ...props },
  ref,
) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggleKeyboard = () => {
    setShowKeyboard((current) => !current);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div>
      {label && (
        <label className="mb-1 block text-label-comp font-label-comp text-label-comp-text">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={(node) => setInputRefs(node, [inputRef, ref])}
          readOnly={keyboardToggle ? readOnly ?? !showKeyboard : readOnly}
          className={cn(
            "w-full h-input-height",
            error ? "bg-danger-bg" : "bg-input-bg",
            "border",
            error ? "border-danger" : "border-input-border",
            "rounded-input",
            "px-input-padding-x",
            keyboardToggle && "pr-16",
            "text-input-text text-input",
            "placeholder:text-input-placeholder",
            "outline-none",
            "transition-colors duration-[var(--motion-fast)]",
            "focus:border-input-border-focus focus:ring-2 focus:ring-input-border-focus/10",
            "disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {keyboardToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleToggleKeyboard}
            aria-label={showKeyboard ? "Hide keyboard" : "Show keyboard"}
          >
            <LuKeyboard className="h-5 w-5" />
          </Button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
