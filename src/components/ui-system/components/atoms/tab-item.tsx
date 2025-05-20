import React from "react";

type TabItemProps = {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

const TabItem = ({
  title,
  icon,
  active = false,
  onClick,
  className = "",
}: TabItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors
        ${active ? "bg-black text-white" : "bg-white text-black"}
        ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span className="text-xs font-medium">{title}</span>
    </button>
  );
};

export default TabItem;