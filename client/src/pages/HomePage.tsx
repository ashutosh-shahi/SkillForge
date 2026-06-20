import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-2xl w-full text-center">

        <h1 className="text-5xl font-bold mb-4">
          SkillForge
        </h1>

        <p className="text-slate-600 mb-8">
          Create professional developer portfolios,
          manage projects, skills and education,
          and share them through public profile pages.
        </p>

        <div className="flex flex-col gap-4">

          <Link
            to="/login"
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-slate-200 py-3 rounded-xl font-semibold"
          >
            Register
          </Link>

          <a
            href="/user/6a3685434f982191403b85e1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            View Demo Portfolio
          </a>

        </div>

      </div>
    </div>
  );
}