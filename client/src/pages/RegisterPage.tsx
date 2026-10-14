import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Toast from "../components/Toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setToast({
        message: "Please fill in all fields",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (password.length < 6) {
      setToast({
        message: "Password must be at least 6 characters long",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      setToast({
        message: "Account Created Successfully! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error: any) {
      console.error("Registration error:", error);

      const serverMessage =
        error?.response?.data?.message ||
        "Registration Failed. Please try again.";

      setToast({
        message: serverMessage,
        type: "error",
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          SkillForge
        </h1>

        <p className="text-slate-500 mb-6">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Name"
            required
            disabled={loading}
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full p-3 border rounded-xl disabled:bg-slate-50"
          />

          <input
            type="email"
            placeholder="Email"
            required
            disabled={loading}
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-3 border rounded-xl disabled:bg-slate-50"
          />

          <input
            type="password"
            placeholder="Password (min. 6 characters)"
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
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}