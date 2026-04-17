import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      await auth?.login(email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      setError(message);
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
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-radius-lg border border-border bg-surface text-title font-[var(--weight-semibold)] text-text-primary">
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
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-heading text-text-primary">Sign In</h2>
              <p className="text-body-sm leading-6 text-text-secondary">
                Enter your credentials to access your account.
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
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-label text-danger">{error}</p>}

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
