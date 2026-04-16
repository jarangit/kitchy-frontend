import { cn } from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export function Skeleton({
  className,
  width = "w-full",
  height = "h-4",
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        circle ? "rounded-full" : "rounded-[var(--radius-md)]",
        width,
        height,
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--card-bg)] border border-[var(--card-border)]",
        "rounded-[var(--card-radius)] p-[var(--card-padding)]",
        "space-y-3",
        className,
      )}
    >
      <Skeleton height="h-5" width="w-2/3" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-1/2" />
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      <Skeleton circle width="w-10" height="h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton height="h-4" width="w-1/3" />
        <Skeleton height="h-3" width="w-2/3" />
      </div>
    </div>
  );
}
