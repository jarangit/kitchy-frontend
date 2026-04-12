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
      className={`border border-black bg-re rounded-xl px-4 py-2 w-fit cursor-pointer transition-all ${
        isActive ? "bg-black text-white" : ""
      } 
            ${bouncing && isCanAnimation && "bg-blue-200 !text-black"}
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
