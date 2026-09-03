import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useEffect, useRef, useState } from "react";

interface Props {
  /** Copy changes between "Sign in with Google" / "Sign up with Google". */
  mode?: "signIn" | "signUp";
  /** Called when the user cancels the flow or Google throws. */
  onError?: (message: string) => void;
  /** Fixed pixel width. Defaults to fitting the container (max 380). */
  width?: number;
}

const MAX_WIDTH = 380;
const MIN_WIDTH = 200;
const FALLBACK_WIDTH = 320;

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
export function GoogleSignInButton({ mode = "signIn", onError, width }: Props) {
  const auth = useAuth();
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(FALLBACK_WIDTH);

  // Google renders a fixed-width iframe, so measure the container and size
  // the button to fit — otherwise a 380px frame stretches narrow layouts
  // (e.g. 390px phones) and pushes sibling content off-screen.
  useEffect(() => {
    if (width !== undefined) return;
    if (typeof ResizeObserver === "undefined") return;
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const next = Math.floor(el.clientWidth);
      if (next > 0) {
        setMeasuredWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={wrapRef} className="flex w-full min-w-0 justify-center">
      <GoogleLogin
        shape="rectangular"
        theme="outline"
        size="large"
        width={String(width ?? measuredWidth)}
        text={mode === "signUp" ? "signup_with" : "signin_with"}
        containerProps={{ className: "flex w-full min-w-0 justify-center" }}
        onSuccess={async ({ credential }) => {
          try {
            if (!credential) {
              onError?.(t("auth.errors.googleFailed"));
              return;
            }
            await auth?.googleLogin(credential);
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : t("auth.errors.googleFailed");
            onError?.(message);
          }
        }}
        onError={() => {
          onError?.(t("auth.errors.googleFailed"));
        }}
      />
    </div>
  );
}
