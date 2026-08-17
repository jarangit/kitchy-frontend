import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  /** Copy changes between "Sign in with Google" / "Sign up with Google". */
  mode?: "signIn" | "signUp";
  /** Called when the user cancels the flow or Google throws. */
  onError?: (message: string) => void;
}

/**
 * Google sign-in button. Assumes `VITE_GOOGLE_CLIENT_ID` is configured —
 * the parent page (login) MUST guard the mount with that env check, because
 * `GoogleLogin` throws when the surrounding provider has an empty client ID.
 *
 * Uses the Google Identity Services credential flow: Google renders its own
 * branded button and returns an ID token (`credential`) directly in-page —
 * no cross-origin popup messaging, so it's unaffected by the COOP / opener
 * restrictions that break `useGoogleLogin`'s implicit popup flow. We forward
 * the ID token to our backend (`POST /users/google-login`) for verification
 * and exchange against our own `access_token`.
 */
export function GoogleSignInButton({ mode = "signIn", onError }: Props) {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <GoogleLogin
      shape="rectangular"
      theme="outline"
      size="large"
      width="380"
      text={mode === "signUp" ? "signup_with" : "signin_with"}
      containerProps={{ className: "flex w-full justify-center" }}
      onSuccess={async ({ credential }) => {
        try {
          if (!credential) {
            onError?.(t("auth.errors.googleFailed"));
            return;
          }
          await auth?.googleLogin(credential);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : t("auth.errors.googleFailed");
          onError?.(message);
        }
      }}
      onError={() => {
        onError?.(t("auth.errors.googleFailed"));
      }}
    />
  );
}
