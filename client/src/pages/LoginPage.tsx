import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("Login Response:", data);

      setAuth(data.token, data.user);

      alert("Login Successful");

      navigate("/");
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log(
          "Server Response:",
          error.response.data
        );
      }

      alert("Login Failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
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
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 border rounded-xl"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);
}