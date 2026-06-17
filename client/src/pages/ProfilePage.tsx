import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  getProfile,
  updateProfile,
} from "../api/userApi";

export default function ProfilePage() {
  const { token } = useAuthStore();
  console.log("Token:", token);

  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!token) return;

  const fetchProfile = async () => {
    try {
      const data = await getProfile(token);

      setProfile(data.user);

        setBio(data.user.bio || "");

        setSkills(
  data.user.skills?.join(", ") || ""
);
    } catch (error) {
      console.error(
        "Profile Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token]);
const handleSave = async () => {
  try {
    if (!token) return;

    const updatedData =
      await updateProfile(
        token,
        {
          bio,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),

          avatar:
            profile.avatar,

          education:
            profile.education,

          projects:
            profile.projects,
        }
      );

    setProfile(
      updatedData.user
    );

    alert(
      "Profile Updated"
    );
  } catch (error) {
    console.error(error);

    alert(
      "Update Failed"
    );
  }
};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!profile) {
    return <h2>No Profile Found</h2>;
  }

  return (
    <div>
      <h1>Profile</h1>

      <h2>{profile.name}</h2>

      <p>Email: {profile.email}</p>

      <div>
  <h3>Bio</h3>

  <textarea
    rows={4}
    value={bio}
    onChange={(e) =>
      setBio(
        e.target.value
      )
    }
  />
</div>

      <div>
  <h3>Skills</h3>

  <input
    type="text"
    value={skills}
    onChange={(e) =>
      setSkills(
        e.target.value
      )
    }
  />

  <p>
    Example:
    Java, React, MongoDB
  </p>
</div>

      <ul>
        {profile.skills.map(
          (
            skill: string,
            index: number
          ) => (
            <li key={index}>
              {skill}
            </li>
          )
        )}
      </ul>

      <h3>Education</h3>

      {profile.education.map(
        (
          edu: any,
          index: number
        ) => (
          <div key={index}>
            <p>
              {edu.degree}
            </p>

            <p>
              {edu.institution}
            </p>

            <p>
              {edu.startYear} -
              {edu.endYear}
            </p>
          </div>
        )
      )}
      <br />

<button
  onClick={handleSave}
>
  Save Profile
</button>
    </div>
  );
}