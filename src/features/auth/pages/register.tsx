import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getApiErrorMessage } from "@/shared/services/api-error";
import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Thai mobile: 10 digits starting with 0 (e.g. 0812345678) — most users
// enter this form. We also accept the already-normalized E.164 shape
// `+66XXXXXXXXX` in case someone pastes it in.
const TH_LOCAL_RE = /^0\d{9}$/;
const TH_E164_RE = /^\+66\d{9}$/;
const MIN_PASSWORD = 8;

type IdentifierKind = "email" | "phone" | "unknown";

// Heuristic: if it contains "@" → email; if it's digits (optionally
// with a leading "+") → phone; otherwise unknown.
const detectIdentifier = (raw: string): IdentifierKind => {
  const value = raw.trim();
  if (!value) return "unknown";
  if (value.includes("@")) return "email";
  if (/^\+?\d+$/.test(value)) return "phone";
  return "unknown";
};

// Normalize a Thai mobile number to E.164 (`+66XXXXXXXXX`). Returns
// `null` when the input doesn't match the supported Thai shapes so
// the caller can surface a specific validation error.
const normalizeThaiPhone = (raw: string): string | null => {
  const value = raw.trim().replace(/[\s-]/g, "");
  if (TH_E164_RE.test(value)) return value;
  if (TH_LOCAL_RE.test(value)) return `+66${value.slice(1)}`;
  return null;
};

const RegisterPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const auth = useAuth();
  const { t } = useTranslation();

  // Mirror the login page guard — only mount the Google button when an
  // OAuth client ID is configured to avoid `useGoogleLogin` crashes.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;
  const googleEnabled = Boolean(googleClientId);

  const validate = (): {
    ok: boolean;
    kind: IdentifierKind;
    normalizedPhone: string | null;
  } => {
    let ok = true;
    const value = identifier.trim();
    const kind = detectIdentifier(value);
    let normalizedPhone: string | null = null;

    if (!value) {
      setIdentifierError(t("auth.errors.emailOrPhoneRequired"));
      ok = false;
    } else if (kind === "email") {
      if (!EMAIL_RE.test(value)) {
        setIdentifierError(t("auth.errors.emailInvalid"));
        ok = false;
      } else {
        setIdentifierError("");
      }
    } else if (kind === "phone") {
      normalizedPhone = normalizeThaiPhone(value);
      if (!normalizedPhone) {
        setIdentifierError(t("auth.errors.phoneInvalid"));
        ok = false;
      } else {
        setIdentifierError("");
      }
    } else {
      setIdentifierError(t("auth.errors.identifierInvalid"));
      ok = false;
    }

    if (!password) {
      setPasswordError(t("auth.errors.passwordRequired"));
      ok = false;
    } else if (password.length < MIN_PASSWORD) {
      setPasswordError(t("auth.errors.passwordTooShort"));
      ok = false;
    } else {
      setPasswordError("");
    }
    return { ok, kind, normalizedPhone };
  };

  const mapServerError = (raw: unknown) => {
    // BE payload shape: { statusCode, error, message, timestamp, path }.
    // We read `message` (string | string[]) and surface duplicate errors
    // directly under the identifier input since there is only one field.
    const message = getApiErrorMessage(raw, t("auth.errors.registerFailed"));

    if (message === "Email already registered") {
      setIdentifierError(t("auth.errors.emailTaken"));
      return;
    }
    if (message === "Phone number already registered") {
      setIdentifierError(t("auth.errors.phoneTaken"));
      return;
    }
    if (message === "Email or phone number is required") {
      setIdentifierError(t("auth.errors.emailOrPhoneRequired"));
      return;
    }
    setFormError(message);
  };

  const handleRegister = async () => {
    setFormError("");
    const { ok, kind, normalizedPhone } = validate();
    if (!ok) return;
    const value = identifier.trim();
    try {
      await auth?.register({
        email: kind === "email" ? value : undefined,
        phoneNumber: kind === "phone" ? normalizedPhone ?? undefined : undefined,
        password,
      });
    } catch (err: unknown) {
      mapServerError(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-2xl space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-title font-[var(--weight-semibold)] text-text-primary">
            K
          </div>
          <div className="space-y-4">
            <p className="text-label text-text-secondary">Kitchy POS</p>
            <h1 className="text-display text-text-primary">
              Start running calmer service in minutes.
            </h1>
            <p className="max-w-xl text-body text-text-secondary">
              Create your Kitchy account to open your first store, set up the
              kitchen, and take an order today.
            </p>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-heading text-text-primary">
                {t("auth.register.title")}
              </h2>
              <p className="text-body-sm leading-6 text-text-secondary">
                {t("auth.register.subtitle")}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              className="space-y-4"
            >
              <Input
                label={t("auth.fields.identifierLabel")}
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder={t("auth.fields.identifierPlaceholder")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={identifierError || undefined}
              />

              <p className="text-caption text-text-secondary">
                {t("auth.register.emailOrPhoneHint")}
              </p>

              <Input
                label={t("auth.fields.passwordLabel")}
                type="password"
                placeholder={t("auth.fields.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError || undefined}
              />

              {formError && (
                <p className="text-label text-danger">{formError}</p>
              )}

              <Button type="submit" className="w-full" loading={auth?.loading}>
                {t("auth.register.submit")}
              </Button>
            </form>

            {googleEnabled && (
              <>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-caption text-text-secondary">
                    {t("auth.divider.or")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <GoogleSignInButton mode="signUp" onError={setFormError} />
              </>
            )}

            <p className="text-center text-body-sm text-text-secondary">
              {t("auth.register.hasAccount")}{" "}
              <Link to="/login" className="text-accent hover:underline">
                {t("auth.register.signInLink")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
