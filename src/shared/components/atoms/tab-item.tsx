import type { ReactNode } from "react";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { cn } from "@/shared/utils/cn";

interface TabItemProps {
  title: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const TabItem = ({
  title,
  icon,
  active = false,
  onClick,
  className,
}: TabItemProps) => {
  return (
    <ChipTab
      active={active}
      size="sm"
      onClick={onClick}
      className={cn("flex-col gap-1 rounded-lg", className)}
    >
      {icon && <span>{icon}</span>}
      <span className="font-medium">{title}</span>
    </ChipTab>
  );
};

export default TabItem;
