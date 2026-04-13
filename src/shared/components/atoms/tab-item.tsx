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
      className={`px-4 py-2 rounded-lg flex flex-col items-center gap-1 transition-all duration-[var(--motion-fast)] active:scale-[0.98]
        ${active ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]" : "bg-[var(--color-bg)] text-[var(--color-text-primary)]"}
        ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default TabItem;