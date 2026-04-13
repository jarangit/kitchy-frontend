import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
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
    <div className="min-h-screen flex">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] px-12">
        {/* Logo square */}
        <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg)]/20 backdrop-blur-sm flex items-center justify-center mb-6">
          <span className="text-4xl font-semibold text-[var(--color-text-inverse)]">
            K
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[var(--color-text-inverse)] mb-2">
          Kitchy POS
        </h1>
        <p className="text-[var(--color-text-inverse)] opacity-80 text-center leading-relaxed">
          ระบบจัดการร้านอาหาร
          <br />
          อัจฉริยะ
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--color-surface)]">
        <div className="max-w-sm w-full bg-[var(--color-bg)] rounded-[var(--radius-lg)] p-8 shadow-sm border border-[var(--color-border)]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Sign In
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Enter your credentials to access your account
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

            {error && (
              <p className="text-sm text-[var(--color-danger)]">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
