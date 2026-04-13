import type { ReactNode } from "react";
import { useLoading } from "@/shared/hooks/useLoading";

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  orderCount: number;
  color?: string;
  onClick?: () => void;
}

export default function RoleCard({
  icon,
  title,
  orderCount,
  color,
  onClick,
}: RoleCardProps) {
  const { isLoading } = useLoading(); // ✅ เรียก Hook มาใช้

  return (
    <div className="rounded-xl  bg-[var(--color-bg)] p-6 flex flex-col gap-10 items-center text-center w-full max-w-xs  xl:min-w-[350px]"         onClick={onClick}
>
      <div className="flex gap-2 w-full items-center justify-start">
        <div className={`text-3xl `}>{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
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
        className="px-6 py-2 rounded-md text-[var(--color-text-inverse)] font-medium w-full cursor-pointer h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        style={{ backgroundColor: color || 'var(--color-primary)' }}
        onClick={onClick}
      >
        Open Station
      </button>
    </div>
  );
}
