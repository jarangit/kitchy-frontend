interface SkeletonProps {
  className?: string;
  /** Width as Tailwind class, e.g. "w-full", "w-32" */
  width?: string;
  /** Height as Tailwind class, e.g. "h-4", "h-10" */
  height?: string;
  /** Makes it a circle */
  circle?: boolean;
}

export function Skeleton({
  className = "",
  width = "w-full",
  height = "h-4",
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={`
        skeleton-shimmer
        ${circle ? "rounded-full" : "rounded-[var(--radius-md)]"}
        ${width} ${height}
        ${className}
      `.trim()}
      aria-hidden="true"
    />
  );
}

/** A preset skeleton for a card layout */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        bg-[var(--card-bg)] border border-[var(--card-border)]
        rounded-[var(--card-radius)] p-[var(--card-padding)]
        space-y-3 ${className}
      `.trim()}
    >
      <Skeleton height="h-5" width="w-2/3" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-1/2" />
    </div>
  );
}

/** A preset skeleton for a list row */
export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 py-3 ${className}`.trim()}>
      <Skeleton circle width="w-10" height="h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton height="h-4" width="w-1/3" />
        <Skeleton height="h-3" width="w-2/3" />
      </div>
    </div>
  );
}
