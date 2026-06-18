import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

export default function DashboardPage() {
  
  const { user, token } = useAuthStore();

  const [profile, setProfile] =
  useState<any>(null);
  useEffect(() => {
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const data = await getProfile(token);

      setProfile(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProfile();
}, [token]);
  const skillsCount =
  profile?.skills?.length || 0;

  const projectsCount =
    profile?.projects?.length || 0;

  const educationCount =
    profile?.education?.length || 0;

  let completion = 0;

if (
  profile?.bio &&
  profile.bio.trim() !== ""
) {
  completion += 25;
}

if (
  profile?.skills?.length > 0
) {
  completion += 25;
}

if (
  profile?.education?.length > 0
) {
  completion += 25;
}

if (
  profile?.projects?.length > 0
) {
  completion += 25;
}

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-10 shadow-lg mb-8">
          <h1 className="text-5xl font-bold mb-3">
            SkillForge
          </h1>

          {user && (
            <>
              <h2 className="text-2xl font-semibold">
                Welcome back, {user.name}
              </h2>

              <p className="text-blue-100 mt-2">
                {user.email}
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-slate-500 text-sm uppercase">
              Skills
            </h3>

            <p className="text-4xl font-bold mt-2">
              {skillsCount}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-slate-500 text-sm uppercase">
              Projects
            </h3>

            <p className="text-4xl font-bold mt-2">
              {projectsCount}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-slate-500 text-sm uppercase">
              Education
            </h3>

            <p className="text-4xl font-bold mt-2">
              {educationCount}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Profile Completion
          </h2>

          <div className="w-full bg-slate-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${completion}%`,
              }}
            />
          </div>

          <p className="mt-3 text-slate-500">
            Your profile is {completion}% complete.
          </p>
        </div>

      </div>
    </div>
  );
}