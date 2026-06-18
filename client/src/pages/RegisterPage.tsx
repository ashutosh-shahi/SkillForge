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

  const [toast, setToast] =
    useState("");

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      setToast(
        "Account Created Successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      setToast(
        "Registration Failed"
      );

      setTimeout(() => {
        setToast("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      {toast && (
        <Toast message={toast} />
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
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
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
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Register
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