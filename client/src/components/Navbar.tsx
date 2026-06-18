import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">

        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            SkillForge
          </Link>
        </div>

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="font-medium text-slate-700 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            className="font-medium text-slate-700 hover:text-blue-600 transition"
          >
            Profile
          </Link>

          {user && (
            <>
              <span className="text-slate-500">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}