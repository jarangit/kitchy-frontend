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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-8xl font-bold text-gray-300">{title}</h1>
      <p className="mt-4 text-xl text-gray-600">{message}</p>
      <button
        onClick={() => navigate(backTo)}
        className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        {backLabel}
      </button>
    </div>
  );
}
