import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

const TabItem = ({
  title,
  icon,
  isActive,
  onClick,
  className = "",
  ...rest
}: Props) => {
  return (
    <div
      className={`border border-black bg-re rounded-xl px-4 py-2 w-fit cursor-pointer ${
        isActive ? "bg-black text-white" : ""
      } ${className}`}
      onClick={onClick}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="">{title}</div>
      </div>
    </div>
  );
};

export default TabItem;
