import { useEffect, useRef, useState, type ReactNode } from "react";
import { LuDelete, LuHash, LuKeyboard, LuLetterText } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface AlphanumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onDone: () => void;
  onRequestDeviceKeyboard?: () => void;
  maxLength?: number;
  hapticFeedback?: boolean;
  label?: string;
  placeholder?: string;
}

const numberRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const englishRows: Array<{ keys: string[]; cols: string }> = [
  { keys: ["A", "B", "C", "D", "E", "F"], cols: "grid-cols-6" },
  { keys: ["G", "H", "I", "J", "K", "L"], cols: "grid-cols-6" },
  { keys: ["M", "N", "O", "P", "Q", "R"], cols: "grid-cols-6" },
  { keys: ["S", "T", "U", "V", "W", "X"], cols: "grid-cols-6" },
  { keys: ["Y", "Z", "-"], cols: "grid-cols-3" },
];

type KeypadMode = "number" | "english";

export function AlphanumericKeypad({
  value,
  onChange,
  onDone,
  onRequestDeviceKeyboard,
  maxLength = 24,
  hapticFeedback = true,
  label,
  placeholder = "—",
}: AlphanumericKeypadProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<KeypadMode>("number");
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const triggerFeedback = () => {
    if (
      !hapticFeedback ||
      typeof navigator === "undefined" ||
      !("vibrate" in navigator)
    ) {
      return;
    }
    navigator.vibrate(8);
  };

  const commit = (nextValue: string) => {
    valueRef.current = nextValue;
    onChange(nextValue);
  };
  const append = (next: string) =>
    commit(`${valueRef.current}${next}`.slice(0, maxLength));
  const clear = () => commit("");
  const backspace = () => commit(valueRef.current.slice(0, -1));
  const handleModeChange = (next: KeypadMode) => {
    triggerFeedback();
    setMode(next);
  };
  const handlePress = (action: () => void) => {
    triggerFeedback();
    action();
  };

  const modeOptions: Array<{
    value: KeypadMode;
    label: string;
    icon: ReactNode;
  }> = [
    {
      value: "number",
      label: t("ui.keypad.tabNumber"),
      icon: <LuHash size={18} />,
    },
    {
      value: "english",
      label: t("ui.keypad.tabEnglish"),
      icon: <LuLetterText size={18} />,
    },
  ];

  return (
    <div className="rounded-card border border-card-border bg-surface p-3">
      {label !== undefined && (
        <div className="mb-3">
          <p className="mb-1 text-caption text-text-tertiary">{label}</p>
          <div className="flex h-input-height items-center rounded-input border border-input-border bg-input-bg px-input-padding-x">
            {value ? (
              <span className="font-mono text-input tabular-nums text-text-primary">
                {value}
                <span className="ml-px inline-block w-px translate-y-[1px] animate-pulse bg-text-primary align-middle text-input leading-none">
                  &nbsp;
                </span>
              </span>
            ) : (
              <span className="font-mono text-input text-input-placeholder">
                {placeholder}
                <span className="ml-px inline-block w-px translate-y-[1px] animate-pulse bg-text-tertiary align-middle text-input leading-none">
                  &nbsp;
                </span>
              </span>
            )}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-caption text-text-tertiary">{t("ui.keypad.mode")}</p>
        <div
          className="flex rounded-full border border-segment-border bg-segment-bg p-1"
          role="group"
          aria-label={t("ui.keypad.mode")}
        >
          {modeOptions.map((option) => {
            const isActive = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                aria-label={option.label}
                onClick={() => handleModeChange(option.value)}
                className={cn(
                  "flex h-[34px] flex-1 items-center justify-center rounded-full px-4 text-segment font-segment transition-colors duration-[var(--motion-fast)]",
                  isActive
                    ? "bg-segment-active-bg text-segment-active-text"
                    : "text-segment-inactive-text hover:text-segment-inactive-text-hover",
                )}
              >
                {option.icon}
              </button>
            );
          })}
          {onRequestDeviceKeyboard && (
            <button
              type="button"
              aria-label={t("ui.keypad.deviceKeyboard")}
              onClick={() => handlePress(onRequestDeviceKeyboard)}
              className="flex h-[34px] flex-1 items-center justify-center rounded-full px-4 text-segment font-segment text-segment-inactive-text transition-colors duration-[var(--motion-fast)] hover:text-segment-inactive-text-hover"
            >
              <LuKeyboard size={18} />
            </button>
          )}
        </div>
      </div>

      {mode === "number" ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {numberRows.flat().map((number) => (
            <Button
              key={number}
              type="button"
              variant="secondary"
              onClick={() => handlePress(() => append(number))}
              className="h-14 text-title tabular-nums"
            >
              {number}
            </Button>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() => handlePress(clear)}
            className="h-14 text-label text-danger"
          >
            {t("ui.keypad.clear")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handlePress(() => append("0"))}
            className="h-14 text-title tabular-nums"
          >
            0
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handlePress(backspace)}
            className="h-14 text-label"
            aria-label={t("ui.keypad.backspace")}
          >
            <LuDelete size={18} />
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {englishRows.map((row) => (
            <div key={row.keys.join("")} className={cn("grid gap-2", row.cols)}>
              {row.keys.map((letter) => (
                <Button
                  key={letter}
                  type="button"
                  variant="secondary"
                  onClick={() => handlePress(() => append(letter))}
                  className="h-12 font-mono text-label"
                >
                  {letter}
                </Button>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handlePress(clear)}
              className="h-14 text-label text-danger"
            >
              {t("ui.keypad.clear")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handlePress(backspace)}
              className="h-14 text-label"
              aria-label={t("ui.keypad.backspace")}
            >
              <LuDelete size={18} />
            </Button>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={() => handlePress(onDone)}
        className="mt-3 h-14 w-full"
      >
        {t("ui.keypad.done")}
      </Button>
    </div>
  );
}
