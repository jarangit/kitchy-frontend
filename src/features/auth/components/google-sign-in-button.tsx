import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  /** Copy changes between "Sign in with Google" / "Sign up with Google". */
  mode?: "signIn" | "signUp";
  /** Called when the user cancels the popup or Google throws. */
  onError?: (message: string) => void;
}

/**
 * Google sign-in button. Assumes `VITE_GOOGLE_CLIENT_ID` is configured —
 * the parent page (login / register) MUST guard the mount with that env
 * check, because `useGoogleLogin` throws when the surrounding provider
 * has an empty client ID.
 *
 * Uses the implicit OAuth flow: Google returns an `access_token` that
 * we forward to our backend (`POST /users/google-login`) for verification
 * and exchange against our own `access_token`.
 */
export function GoogleSignInButton({ mode = "signIn", onError }: Props) {
  const auth = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        await auth?.googleLogin(tokenResponse.access_token);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("auth.errors.googleFailed");
        onError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      onError?.(t("auth.errors.googleFailed"));
    },
  });

  const label =
    mode === "signUp" ? t("auth.google.signUp") : t("auth.google.signIn");

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      loading={isLoading}
      onClick={() => login()}
    >
      <GoogleMark className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}
