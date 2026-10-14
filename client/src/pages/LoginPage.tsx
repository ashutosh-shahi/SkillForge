import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import Toast from "../components/Toast";

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setToast({ message: "Please enter your email and password", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      console.log("Login Response:", data);

      setAuth(data.token, data.user);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      const errorMsg =
        error?.response?.data?.message || "Invalid email or password. Please try again.";

      setToast({ message: errorMsg, type: "error" });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    {toast && <Toast message={toast.message} type={toast.type} />}
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          SkillForge
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          required
          disabled={loading}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 border rounded-xl disabled:bg-slate-50"
        />

        <input
          type="password"
          placeholder="Password"
          required
          disabled={loading}
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 border rounded-xl disabled:bg-slate-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-medium"
        >
          Register
        </Link>
      </p>
    </div>
  </div>
);
}