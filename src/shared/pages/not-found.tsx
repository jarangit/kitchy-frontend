import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

interface Props {
  title?: string;
  message?: string;
  backTo?: string;
  backLabel?: string;
}

export default function NotFoundPage({
  title = "404",
  message = "Page not found",
  backTo = "/",
  backLabel = "Go back home",
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-4">
      <h1 className="text-8xl font-semibold text-text-tertiary">{title}</h1>
      <p className="mt-4 text-title text-text-secondary">{message}</p>
      <Button
        onClick={() => navigate(backTo)}
        className="mt-8"
      >
        {backLabel}
      </Button>
    </div>
  );
}
