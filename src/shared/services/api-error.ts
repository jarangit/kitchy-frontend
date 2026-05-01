import axios from "axios";

type ApiErrorPayload = {
  message?: string | string[];
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const message = payload?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};
