import { useNavigate } from "react-router-dom";

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
      <h1 className="text-8xl font-[var(--weight-semibold)] text-text-tertiary">{title}</h1>
      <p className="mt-4 text-title text-text-secondary">{message}</p>
      <button
        onClick={() => navigate(backTo)}
        className="mt-8 h-11 cursor-pointer rounded-radius-sm bg-primary px-6 text-text-inverse transition-all duration-[var(--motion-fast)] hover:bg-primary-hover"
      >
        {backLabel}
      </button>
    </div>
  );
}
