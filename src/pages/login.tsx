import { userServiceApi } from "@/service/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await userServiceApi.login(email, password);
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        window.location.href = "/user-dashboard";
        // navigate("/user-dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Login failed");
      return;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userServiceApi.getMe().then((user) => {
        if (user) {
          navigate("/user-dashboard");
        }
      }).catch(() => {
        // If token is invalid, do nothing
      });
    }
  }, []);
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1
        className="text-xl font-bold mb-4"
      >
        Login
      </h1>
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
          className="w-full mb-2 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
