import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { cn } from "@/shared/utils/cn";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
  title: string;
  count?: number;
  icon?: ReactNode;
  active?: boolean;
  isActive?: boolean;
  isCanAnimation?: boolean;
};

const TabItem = ({
  title,
  icon,
  count,
  active,
  isActive,
  isCanAnimation = false,
  className,
  ...rest
}: Props) => {
  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(count ?? 0);
  const resolvedActive = active ?? isActive ?? false;

  useEffect(() => {
    const nextCount = count ?? 0;

    if (nextCount > prevCount.current && prevCount.current !== 0) {
      setBouncing(true);
      const timeout = setTimeout(() => setBouncing(false), 300);
      return () => clearTimeout(timeout);
    }
    prevCount.current = nextCount;
  }, [count]);

  useEffect(() => {
    prevCount.current = count ?? 0;
  }, [count]);

  return (
    <ChipTab
      active={resolvedActive}
      size="sm"
      className={cn(
        "gap-2",
        count === undefined && "flex-col gap-1 rounded-lg",
        bouncing && isCanAnimation && "bg-info-bg text-text-primary",
        className,
      )}
      {...rest}
    >
      {icon && <span>{icon}</span>}
      <span className={cn(count === undefined && "font-[var(--weight-medium)]")}>
        {title}
        {count !== undefined && (
          <span className={cn(bouncing && isCanAnimation && "animate-ping")}>
            {` (${count})`}
          </span>
        )}
      </span>
    </ChipTab>
  );
};

export default TabItem;
