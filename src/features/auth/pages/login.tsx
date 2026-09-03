import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { BrandMark } from "@/shared/components/ui/brand-mark";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { getDemoTrialUrl } from "@/features/auth/utils/demo-trial-url";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IS_DEMO_MODE } from "@/shared/services/adapters/data-adapter";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { t, language, setLanguage } = useTranslation();

  // This page is always Thai: force `th` while mounted and restore the
  // previous language on unmount so the rest of the app is untouched.
  // `setLanguage` is React's stable state setter, safe as the only dep.
  const previousLanguageRef = useRef(language);
  useEffect(() => {
    setLanguage("th");
    const previous = previousLanguageRef.current;
    return () => {
      setLanguage(previous);
    };
  }, [setLanguage]);

  // Only mount the Google button when an OAuth client ID is configured.
  // `useGoogleLogin` throws when wrapped in a provider with an empty
  // clientId, which would crash the whole login screen otherwise.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    string | undefined;
  const googleEnabled = Boolean(googleClientId) && !IS_DEMO_MODE;
  // External demo site, configured later via VITE_DEMO_TRIAL_URL.
  // Button stays hidden until the URL is set.
  const demoTrialUrl = getDemoTrialUrl();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && auth?.user) {
      navigate("/dashboard");
    }
  }, [auth?.user, navigate]);

  return (
    <div className="min-h-screen bg-bg">
      <main className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-stretch gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-10">
        {/* Primary hero panel */}
        <section className="flex min-w-0 flex-col justify-between gap-10 rounded-card bg-primary px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex items-center gap-3">
            <BrandMark className="border-transparent bg-text-inverse text-primary" />
            <p className="text-label text-text-inverse">
              {t("auth.login.heroEyebrow")}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="h-1.5 w-12 rounded-full bg-accent"
            />
            <h1 className="max-w-xl break-words text-display text-text-inverse">
              {t("auth.login.heroTitle")}
            </h1>
            <p className="max-w-xl break-words text-body text-text-inverse/70">
              {t("auth.login.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Sign-in card */}
        <div className="flex min-w-0 items-center justify-center">
          <Card className="w-full max-w-md">
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

              {demoTrialUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => window.location.assign(demoTrialUrl)}
                >
                  {t("auth.trial.cta")}
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
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
