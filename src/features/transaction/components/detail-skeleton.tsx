import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton height="h-9" width="w-32" />
      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton height="h-7" width="w-36" />
          <Skeleton height="h-6" width="w-20" />
        </div>
        <Skeleton height="h-4" width="w-48" />
        <div className="space-y-2 border-t border-border pt-5">
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-4" width="w-1/2" />
        </div>
      </Card>
    </div>
  );
}

export default DetailSkeleton;
