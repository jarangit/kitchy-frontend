import { userServiceApi } from "@/service/user";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

// ฟังก์ชันสำหรับเช็คว่า token หมดอายุหรือยัง (JWT)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    // exp เป็นวินาที (Unix timestamp)
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true; // ถ้า decode ไม่ได้ ให้ถือว่าหมดอายุ
  }
}

const LoginPage = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Reset error message
    try {
      const res = await userServiceApi.login(email, password);
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        navigate("/user-dashboard") ;
      }
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      navigate("/user-dashboard");
    } else {
      localStorage.removeItem("token");
    }
  }, []);
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
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
        onClick={handleLogin}
        className="w-full bg-black text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
