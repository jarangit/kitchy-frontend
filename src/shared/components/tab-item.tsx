import React, { useEffect, useRef, useState } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  count: number;
  icon: React.ReactNode;
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
  className = "",

  ...rest
}: Props) => {
  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(count); // ใช้เก็บค่าเดิม

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
      className={`border border-[var(--color-border)] rounded-xl px-4 py-2 w-fit cursor-pointer transition-all active:scale-[0.98] duration-[var(--motion-fast)] ${
        isActive ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]" : ""
      } 
            ${bouncing && isCanAnimation && "bg-[var(--color-info-bg)] text-[var(--color-text-primary)]"}
      ${className}`}
      onClick={onClick}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          {`${title} `}
          <span
            className={`      ${bouncing && isCanAnimation && "animate-ping"}
`}
          >{`(${count})`}</span>
        </div>
      </div>
    </div>
  );
};

export default TabItem;
