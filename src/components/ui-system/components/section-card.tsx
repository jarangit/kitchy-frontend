import type { ReactNode } from "react";
import { useLoading } from "../../../hooks/useLoading";

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
  const { isLoading } = useLoading(); // ✅ เรียก Hook มาใช้

  return (
    <div className="rounded-xl  bg-white p-6 flex flex-col gap-10 items-center text-center w-full max-w-xs  xl:min-w-[350px]"         onClick={onClick}
>
      <div className="flex gap-2 w-full items-center justify-start">
        <div className={`text-3xl `}>{icon}</div>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p className="text-lg font-semibold mt-1 mb-4">
        {isLoading ? (
          "Loading"
        ) : (
          <>
            {orderCount} Order{orderCount !== 1 ? "s" : ""}
          </>
        )}
      </p>
      <button
        className={`px-6 py-2 rounded-md text-white font-medium w-full ${colorClass} cursor-pointer`}
        onClick={onClick}
      >
        Enter
      </button>
    </div>
  );
}
