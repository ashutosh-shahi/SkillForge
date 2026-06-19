import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import Toast from "../components/Toast";
import {
  getProfile,
  updateProfile,
} from "../api/userApi";

export default function ProfilePage() {
  const { token } = useAuthStore();
  console.log("Token:", token);
  const [editingIndex, setEditingIndex] =
  useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [projectTitle, setProjectTitle] =
  useState("");
  const [education, setEducation] =
  useState({
    institution: "",
    degree: "",
    startYear: "",
    endYear: "",
  });
  
  
  const [toast, setToast] =
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
  const [loading, setLoading] = useState(true);

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

    setToast(
      "Profile Updated"
    );

    setTimeout(() => {
      setToast("");
    }, 3000);
  } catch (error) {
    console.error(error);

    alert(
      "Update Failed"
    );
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white px-8 py-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
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
      let updatedProjects;

if (
  editingIndex !== null
) {
  updatedProjects = [
    ...profile.projects,
  ];

  updatedProjects[
    editingIndex
  ] = newProject;
} else {
  updatedProjects = [
    ...profile.projects,
    newProject,
  ];
}

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

      setProjectTitle("");
      setProjectDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setTechnologies("");
      setEditingIndex(null);

      setToast(
        editingIndex !== null
          ? "Project Updated"
          : "Project Added"
      );

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (error) {
      console.error(error);

      alert(
        "Failed To Add Project"
      );
    }
  };
  const handleAddEducation =
  async () => {
    try {
      if (!token) return;

      const newEducation = {
        institution:
          education.institution,
        degree:
          education.degree,
        startYear: Number(
          education.startYear
        ),
        endYear: Number(
          education.endYear
        ),
      };

      const updatedEducation = [
        ...(profile.education || []),
        newEducation,
      ];

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
              updatedEducation,
            projects:
              profile.projects,
          }
        );

      setProfile(
        updatedData.user
      );

      setEducation({
        institution: "",
        degree: "",
        startYear: "",
        endYear: "",
      });

      setToast(
        "Education Added"
      );

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (error) {
      console.error(error);

      alert(
        "Failed To Add Education"
      );
    }
  };
  const handleEditProject = (
  project: any,
  index: number
) => {
  setProjectTitle(project.title);

  setProjectDescription(
    project.description
  );

  setGithubUrl(
    project.githubUrl
  );

  setLiveUrl(
    project.liveUrl
  );

  setTechnologies(
    project.technologies.join(", ")
  );

  setEditingIndex(index);
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

      setToast(
          "Project Deleted"
        );

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (error) {
      console.error(error);

      alert(
        "Delete Failed"
      );
    }
  };
return (
  <div className="min-h-screen bg-slate-100 p-8">
    <div className="max-w-6xl mx-auto">

      {toast && (
        <Toast message={toast} />
      )}

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold">
          {profile.name}
        </h1>

        <p className="text-slate-500 mt-2">
          {profile.email}
        </p>

        <div className="mt-4">
          <p className="text-slate-500">
            Public Portfolio
          </p>

          <a
            href={`/user/${profile._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Portfolio
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Bio
          </h3>

          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Skills
          </h3>

          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <p className="text-sm text-slate-500 mt-3">
            Example: Java, React, MongoDB
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map(
              (skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
  <h3 className="text-xl font-semibold mb-4">
    Education
  </h3>

  <div className="grid gap-4 mb-6">

    <input
      type="text"
      placeholder="Institution"
      value={education.institution}
      onChange={(e) =>
        setEducation({
          ...education,
          institution:
            e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Degree"
      value={education.degree}
      onChange={(e) =>
        setEducation({
          ...education,
          degree:
            e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <select
  value={education.startYear}
  onChange={(e) =>
    setEducation({
      ...education,
      startYear: e.target.value,
    })
  }
  className="border rounded-xl p-3"
>
  <option value="">
    Select Start Year
  </option>

  {Array.from(
    { length: 26 },
    (_, i) => 2010 + i
  ).map((year) => (
    <option
      key={year}
      value={year}
    >
      {year}
    </option>
  ))}
</select>

    <select
  value={education.endYear}
  onChange={(e) =>
    setEducation({
      ...education,
      endYear: e.target.value,
    })
  }
  className="border rounded-xl p-3"
>
  <option value="">
    Select End Year
  </option>

  {Array.from(
    { length: 26 },
    (_, i) => 2010 + i
  ).map((year) => (
    <option
      key={year}
      value={year}
    >
      {year}
    </option>
  ))}
</select>

    <button
      onClick={
        handleAddEducation
      }
      className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
    >
      Add Education
    </button>

  </div>

  {profile.education &&
  profile.education.length >
    0 ? (
    profile.education.map(
      (
        edu: any,
        index: number
      ) => (
        <div
          key={index}
          className="border-b py-4"
        >
          <h4 className="font-semibold">
            {edu.degree}
          </h4>

          <p>
            {edu.institution}
          </p>

          <p className="text-slate-500">
            {edu.startYear}
            {" - "}
            {edu.endYear}
          </p>
        </div>
      )
    )
  ) : (
    <p className="text-slate-500">
      No education added yet.
    </p>
  )}
</div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Add Project
        </h3>

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) =>
              setProjectTitle(e.target.value)
            }
            className="border rounded-xl p-3"
          />

          <textarea
            placeholder="Description"
            value={projectDescription}
            onChange={(e) =>
              setProjectDescription(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={(e) =>
              setGithubUrl(e.target.value)
            }
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Live URL"
            value={liveUrl}
            onChange={(e) =>
              setLiveUrl(e.target.value)
            }
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="React, Node, MongoDB"
            value={technologies}
            onChange={(e) =>
              setTechnologies(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
          />

          <button
            onClick={handleAddProject}
        className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
      >
        {editingIndex !== null
          ? "Update Project"
          : "Add Project"}
          </button>

        </div>
      </div>
      

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Projects
        </h3>

        {profile.projects &&
        profile.projects.length > 0 ? (
          <div className="grid gap-4">

            {profile.projects.map(
              (
                project: any,
                index: number
              ) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5"
                >
                  <h4 className="text-lg font-semibold">
                    {project.title}
                  </h4>

                  <p className="mt-2">
                    {project.description}
                  </p>

                  <p className="mt-2">
                    Technologies:{" "}
                    {project.technologies?.join(
                      ", "
                    )}
                  </p>

                  <div className="mt-3 flex flex-col gap-2">

                    <a
                      href={project.githubUrl}
                      target="_blank"
                    >
                      GitHub
                    </a>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                    >
                      Live Demo
                    </a>

                  </div>
                  <button
                    onClick={() =>
                      handleEditProject(
                        project,
                        index
                      )
                    }
                    className="mt-4 mr-3 bg-amber-500 text-white px-4 py-2 rounded-xl"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(
                        index
                      )
                    }
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-slate-700">
              No Projects Yet
            </h3>

            <p className="text-slate-500 mt-3">
              Add your first project to showcase your work.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Save Profile
      </button>

    </div>
  </div>
);
}