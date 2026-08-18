import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrandMark } from "@/shared/components/ui/brand-mark";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/i18n/use-translation";
import { pairingCodeServiceApi } from "@/features/device/services/device";
import { saveDeviceToken } from "@/features/device/utils/device-token";

const PairPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const result = await pairingCodeServiceApi.join(
        code.trim().toUpperCase(),
      );
      saveDeviceToken(result.access_token);
      navigate(result.storeId ? `/store/${result.storeId}/kds` : "/login", {
        replace: true,
      });
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response
        ?.status;
      setError(
        status === 400 || status === 404
          ? t("pair.error.invalid")
          : t("pair.error.generic"),
      );
      setLoading(false);
    }
  };

  return (
    <div className="page-shell-loose min-h-screen bg-bg">
      <main className="page-grid-loose mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center lg:grid-cols-[1.1fr_0.9fr]">
        <section className="page-stack max-w-2xl">
          <BrandMark />
          <div className="page-hero-stack">
            <p className="text-label text-text-secondary">Kitchy KDS</p>
            <h1 className="text-display text-text-primary">
              {t("pair.title")}
            </h1>
            <p className="max-w-xl text-body text-text-secondary">
              {t("pair.subtitle")}
            </p>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md lg:self-center">
          <CardContent className="page-stack-tight">
            <div className="space-y-2">
              <h2 className="text-heading text-text-primary">
                {t("pair.title")}
              </h2>
              <p className="text-body-sm leading-6 text-text-secondary">
                {t("pair.subtitle")}
              </p>
            </div>

            {error && <p className="text-label text-danger">{error}</p>}

            <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pair-code">{t("pair.codePlaceholder")}</Label>
                <Input
                  id="pair-code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.toUpperCase().slice(0, 12))
                  }
                  placeholder={t("pair.codePlaceholder")}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                loadingText={t("pair.pairing")}
              >
                {t("pair.submit")}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="text-body-sm text-accent-text hover:underline"
              >
                {t("pair.backToLogin")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PairPage;
