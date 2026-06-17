import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Navbar />

      <h1>SkillForge Dashboard</h1>

      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>
        </>
      ) : (
        <p>Not Logged In</p>
      )}
    </div>
  );
}