import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getApiErrorMessage } from "@/shared/services/api-error";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IS_DEMO_MODE } from "@/shared/services/adapters/data-adapter";

const LoginPage = () => {
  const [email, setEmail] = useState(IS_DEMO_MODE ? "demo@kitchy.app" : "");
  const [password, setPassword] = useState(IS_DEMO_MODE ? "demo1234" : "");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // Only mount the Google button when an OAuth client ID is configured.
  // `useGoogleLogin` throws when wrapped in a provider with an empty
  // clientId, which would crash the whole login screen otherwise.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;
  const googleEnabled = Boolean(googleClientId) && !IS_DEMO_MODE;

  const handleLogin = async () => {
    try {
      setError("");
      await auth?.login(email, password);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("auth.errors.loginFailed")));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && auth?.user) {
      navigate("/dashboard");
    }
  }, [auth?.user, navigate]);

  return (
    <div className="min-h-screen bg-bg px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-2xl space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-title font-[var(--weight-semibold)] text-text-primary">
            K
          </div>
          <div className="space-y-4">
            <p className="text-label text-text-secondary">Kitchy POS</p>
            <h1 className="text-display text-text-primary">Calm operations for busy restaurant teams.</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Sign in to manage stores, monitor service flow, and keep every station aligned from one quiet workspace.
            </p>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md">
          <CardContent className="space-y-6">
            {IS_DEMO_MODE && (
              <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-center text-caption text-accent">
                Demo Mode — ข้อมูลจำลองเก็บใน localStorage
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-heading text-text-primary">{t("auth.login.title")}</h2>
              <p className="text-body-sm leading-6 text-text-secondary">
                {t("auth.login.subtitle")}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <Input
                label={t("auth.fields.emailLabel")}
                type="email"
                placeholder={t("auth.fields.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label={t("auth.fields.passwordLabel")}
                type="password"
                placeholder={t("auth.fields.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-label text-danger">{error}</p>}

              <Button type="submit" className="w-full" loading={auth?.loading}>
                {t("auth.login.submit")}
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

                <GoogleSignInButton mode="signIn" onError={setError} />
              </>
            )}

            <p className="text-center text-body-sm text-text-secondary">
              {t("auth.login.noAccount")}{" "}
              <Link
                to="/register"
                className="text-accent hover:underline"
              >
                {t("auth.login.signUpLink")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
