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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}