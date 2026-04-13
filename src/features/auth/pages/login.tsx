import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
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
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Sign In</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border border-[var(--color-border)] rounded-[var(--input-radius)] bg-[var(--color-bg)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-hover)] transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border border-[var(--color-border)] rounded-[var(--input-radius)] bg-[var(--color-bg)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-hover)] transition-colors"
        />
        {error && <p className="text-[var(--color-danger)]">{error}</p>}
        <Button
          type="submit"
          className="w-full h-11"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
