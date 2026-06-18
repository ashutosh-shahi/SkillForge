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
  const [projectTitle, setProjectTitle] =
  useState("");

const [
  projectDescription,
  setProjectDescription,
] = useState("");

const [githubUrl, setGithubUrl] =
  useState("");

const [liveUrl, setLiveUrl] =
  useState("");

const [
  technologies,
  setTechnologies,
] = useState("");
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
const handleAddProject =
  async () => {
    try {
      if (!token) return;

      const newProject = {
        title: projectTitle,
        description:
          projectDescription,
        githubUrl,
        liveUrl,
        technologies:
          technologies
            .split(",")
            .map((tech) =>
              tech.trim()
            )
            .filter(Boolean),
      };

      const updatedData =
        await updateProfile(
          token,
          {
            bio,
            skills:
              profile.skills,
            avatar:
              profile.avatar,
            education:
              profile.education,
            projects: [
              ...profile.projects,
              newProject,
            ],
          }
        );

      setProfile(
        updatedData.user
      );

      setProjectTitle("");
      setProjectDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setTechnologies("");

      alert(
        "Project Added"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed To Add Project"
      );
    }
  };
  const handleDeleteProject =
  async (
    projectIndex: number
  ) => {
    try {
      if (!token) return;

      const updatedProjects =
        profile.projects.filter(
          (
            _: any,
            index: number
          ) =>
            index !==
            projectIndex
        );

      const updatedData =
        await updateProfile(
          token,
          {
            bio,
            skills:
              profile.skills,
            avatar:
              profile.avatar,
            education:
              profile.education,
            projects:
              updatedProjects,
          }
        );

      setProfile(
        updatedData.user
      );

      alert(
        "Project Deleted"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Delete Failed"
      );
    }
  };
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
      <h3>Add Project</h3>

<input
  type="text"
  placeholder="Project Title"
  value={projectTitle}
  onChange={(e) =>
    setProjectTitle(
      e.target.value
    )
  }
/>

<br />
<br />

<textarea
  placeholder="Description"
  value={
    projectDescription
  }
  onChange={(e) =>
    setProjectDescription(
      e.target.value
    )
  }
/>

<br />
<br />

<input
  type="text"
  placeholder="GitHub URL"
  value={githubUrl}
  onChange={(e) =>
    setGithubUrl(
      e.target.value
    )
  }
/>

<br />
<br />

<input
  type="text"
  placeholder="Live URL"
  value={liveUrl}
  onChange={(e) =>
    setLiveUrl(
      e.target.value
    )
  }
/>

<br />
<br />

<input
  type="text"
  placeholder="React, Node, MongoDB"
  value={technologies}
  onChange={(e) =>
    setTechnologies(
      e.target.value
    )
  }
/>

<br />
<br />

<button
  onClick={
    handleAddProject
  }
>
  Add Project
</button>

<br />
<br />
      <h3>Projects</h3>

{profile.projects &&
profile.projects.length > 0 ? (
  profile.projects.map(
    (
      project: any,
      index: number
    ) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <h4>
          {project.title}
        </h4>

        <p>
          {
            project.description
          }
        </p>

        <p>
          Technologies:
          {" "}
          {project.technologies?.join(
            ", "
          )}
        </p>

        <p>
          GitHub:
          {" "}
          <a
            href={
              project.githubUrl
            }
            target="_blank"
          >
            {
              project.githubUrl
            }
          </a>
        </p>

        <p>
          Live:
          {" "}
          <a
            href={
              project.liveUrl
            }
            target="_blank"
          >
            {project.liveUrl}
          </a>
          
        </p>
        <button
          onClick={() =>
            handleDeleteProject(index)
          }
        >
          Delete Project
        </button>
      </div>
    )
  )
) : (
  <p>
    No Projects Added
  </p>
)}

<button
  onClick={handleSave}
>
  Save Profile
</button>
    </div>
  );
}