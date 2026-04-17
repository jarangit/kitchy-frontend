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
  const { isLoading } = useLoading();

  return (
    <div
      className="flex w-full max-w-xs flex-col items-center gap-10 rounded-radius-md bg-bg p-6 text-center xl:min-w-[350px]"
      onClick={onClick}
    >
      <div className="flex gap-2 w-full items-center justify-start">
        <div className={`text-display `}>{icon}</div>
        <h2 className="text-subtitle">{title}</h2>
      </div>
      <p className="text-subtitle mt-1 mb-4">
        {isLoading ? (
          "Loading"
        ) : (
          <>
            {orderCount} Order{orderCount !== 1 ? "s" : ""}
          </>
        )}
      </p>
      <button
        className="h-11 w-full cursor-pointer rounded-radius-sm bg-primary px-6 py-2 font-[var(--weight-medium)] text-text-inverse transition-all duration-[var(--motion-fast)] hover:bg-primary-hover"
        style={color ? { backgroundColor: color } : undefined}
        onClick={onClick}
      >
        Open Station
      </button>
    </div>
  );
}
