import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
  onClick,
}: RoleCardProps) {
  const { isLoading } = useLoading();

  return (
    <Card
      className="flex w-full max-w-xs flex-col items-center gap-10 bg-bg p-6 text-center xl:min-w-[350px]"
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-start gap-2">
        <div className="text-display">{icon}</div>
        <h2 className="text-subtitle">{title}</h2>
      </div>
      <p className="mb-4 mt-1 text-subtitle">
        {isLoading ? (
          <Skeleton height="h-6" width="w-24" />
        ) : (
          <>
            {orderCount} Order{orderCount !== 1 ? "s" : ""}
          </>
        )}
      </p>
      <Button
        type="button"
        className="w-full"
        onClick={onClick}
      >
        Open Station
      </Button>
    </Card>
  );
}
