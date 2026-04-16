import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  title: string;
  count: number;
  icon: ReactNode;
  isActive: boolean;
  isCanAnimation?: boolean;
  onClick: () => void;
};

const TabItem = ({
  title,
  icon,
  count,
  isActive,
  onClick,
  isCanAnimation = false,
  className,
  ...rest
}: Props) => {
  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current && prevCount.current !== 0) {
      setBouncing(true);
      const timeout = setTimeout(() => setBouncing(false), 300);
      return () => clearTimeout(timeout);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  return (
    <div
      className={cn(
        "border border-[var(--color-border)] rounded-xl px-4 py-2 w-fit cursor-pointer",
        "transition-all duration-[var(--motion-fast)] active:scale-[0.98]",
        isActive && "bg-[var(--chip-active-bg)] text-[var(--chip-active-text)]",
        bouncing && isCanAnimation && "bg-[var(--color-info-bg)] text-[var(--color-text-primary)]",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          {`${title} `}
          <span className={cn(bouncing && isCanAnimation && "animate-ping")}>
            {`(${count})`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TabItem;
