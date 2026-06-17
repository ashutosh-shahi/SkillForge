import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav>
      <Link to="/">Dashboard</Link>
      {" | "}
      <Link to="/profile">Profile</Link>
      {" | "}

      {user ? (
        <>
          <span>{user.name}</span>
          {" "}
          <button onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login">
          Login
        </Link>
      )}
    </nav>
  );
}