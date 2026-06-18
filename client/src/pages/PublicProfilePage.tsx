import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../api/userApi";

export default function PublicProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          if (!id) return;

          const data =
            await getPublicProfile(id);

          setProfile(data.user);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Portfolio...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold">
            {profile.name}
          </h1>

          <p className="text-slate-500 mt-2">
            {profile.bio}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {profile.skills.map(
              (
                skill: string,
                index: number
              ) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Education
          </h2>

          {profile.education.map(
            (
              edu: any,
              index: number
            ) => (
              <div
                key={index}
                className="mb-4"
              >
                <h3 className="font-semibold">
                  {edu.degree}
                </h3>

                <p>
                  {edu.institution}
                </p>

                <p>
                  {edu.startYear}
                  {" - "}
                  {edu.endYear}
                </p>
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Projects
          </h2>

          {profile.projects.map(
            (
              project: any,
              index: number
            ) => (
              <div
                key={index}
                className="border rounded-2xl p-5 mb-4"
              >
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="mt-2">
                  {project.description}
                </p>

                <p className="mt-2 text-slate-500">
                  {project.technologies.join(
                    ", "
                  )}
                </p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}