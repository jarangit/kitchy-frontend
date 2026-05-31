import { LuCircleAlert } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Retry",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-20",
        className,
      )}
    >
      <div className="mb-5 text-danger">
        <LuCircleAlert size={40} aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-subtitle font-medium text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="max-w-xs text-center text-body-sm leading-6 text-text-secondary">
          {description}
        </p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
