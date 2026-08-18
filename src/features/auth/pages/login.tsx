import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { BrandMark } from "@/shared/components/ui/brand-mark";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IS_DEMO_MODE } from "@/shared/services/adapters/data-adapter";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // Only mount the Google button when an OAuth client ID is configured.
  // `useGoogleLogin` throws when wrapped in a provider with an empty
  // clientId, which would crash the whole login screen otherwise.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    string | undefined;
  const googleEnabled = Boolean(googleClientId) && !IS_DEMO_MODE;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && auth?.user) {
      navigate("/dashboard");
    }
  }, [auth?.user, navigate]);

  return (
    <div className="page-shell-loose min-h-screen bg-bg">
      <main className="page-grid-loose mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-start lg:items-center lg:grid-cols-[1.1fr_0.9fr]">
        <section className="page-stack max-w-2xl">
          <BrandMark />
          <div className="page-hero-stack">
            <p className="text-label text-text-secondary">Kitchy POS</p>
            <h1 className="text-display text-text-primary">
              Calm operations for busy restaurant teams.
            </h1>
            <p className="max-w-xl text-body text-text-secondary">
              Sign in with Google to manage stores, monitor service flow, and
              keep every station aligned from one quiet workspace.
            </p>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md lg:self-center">
          <CardContent className="page-stack-tight">
            {IS_DEMO_MODE && (
              <div className="rounded-lg border border-accent-border bg-accent-bg px-3 py-2 text-center text-caption text-accent-text">
                Demo Mode — ข้อมูลจำลองเก็บใน localStorage
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-heading text-text-primary">
                {t("auth.login.title")}
              </h2>
              <p className="text-body-sm leading-6 text-text-secondary">
                {t("auth.login.subtitle")}
              </p>
            </div>

            {error && <p className="text-label text-danger">{error}</p>}

            {googleEnabled ? (
              <GoogleSignInButton mode="signIn" onError={setError} />
            ) : !IS_DEMO_MODE ? (
              <p className="text-body-sm text-text-secondary">
                {t("auth.google.unavailable")}
              </p>
            ) : null}

            {IS_DEMO_MODE && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/try")}
              >
                {t("auth.demo.login")}
              </Button>
            )}

            <Link
              to="/pair"
              className="text-center text-body-sm text-accent-text hover:underline"
            >
              {t("pair.loginLink")}
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
