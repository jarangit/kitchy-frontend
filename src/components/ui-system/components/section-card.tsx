import type { ReactNode } from "react";

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  orderCount: number;
  colorClass?: string;
  onClick?: () => void;
}

export default function RoleCard({
  icon,
  title,
  orderCount,
  colorClass = "bg-orange-500",
  onClick,
}: RoleCardProps) {
  return (
    <div className="rounded-xl  bg-white p-6 flex flex-col gap-10 items-center text-center w-full max-w-xs border border-gray-200">
      <div className="flex gap-2 w-full items-center justify-start" >
        <div className={`text-3xl `}>{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-md mt-1 mb-4">
        {orderCount} Order{orderCount !== 1 ? "s" : ""}
      </p>
      <button
        className={`px-6 py-2 rounded-md text-white font-medium w-full ${colorClass}`}
        onClick={onClick}
      >
        Enter
      </button>
    </div>
  );
}
