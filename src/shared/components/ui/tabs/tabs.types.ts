import type { ButtonHTMLAttributes, ReactNode } from "react";

export type TabsVariant = "chip" | "segmented";
export type TabsSize = "sm" | "md" | "lg";

export interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  registerTab: (value: string) => void;
  unregisterTab: (value: string) => void;
  focusValue: string | null;
  setFocusValue: (value: string | null) => void;
  getOrderedValues: () => string[];
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  children: ReactNode;
}

export interface TabListProps {
  scrollable?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "children"> {
  value: string;
  icon?: ReactNode;
  count?: number;
  animateOnCountIncrease?: boolean;
  children: ReactNode;
}
