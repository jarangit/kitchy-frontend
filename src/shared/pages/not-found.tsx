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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-surface)] px-4">
      <h1 className="text-8xl font-bold text-[var(--color-text-tertiary)]">{title}</h1>
      <p className="mt-4 text-xl text-[var(--color-text-secondary)]">{message}</p>
      <button
        onClick={() => navigate(backTo)}
        className="mt-8 px-6 h-11 bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] rounded-lg hover:opacity-90 transition-all duration-[var(--motion-fast)] active:scale-[0.98] cursor-pointer"
      >
        {backLabel}
      </button>
    </div>
  );
}
