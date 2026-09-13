import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-20",
        className,
      )}
    >
      <div className="mb-5 text-text-tertiary">
        <Spinner size="md" label={title} />
      </div>
      <h3 className="mb-1 text-subtitle font-medium text-text-primary">
        {title}
      </h3>
    </div>
  );
}
