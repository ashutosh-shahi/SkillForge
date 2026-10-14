import { useState, useEffect } from "react";
import {
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  RefreshCw,
  Copy,
  Check,
  Code,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Lightbulb,
  Award,
} from "lucide-react";
import { getPortfolioDiagnosis } from "../api/aiApi";
import type { PortfolioDiagnosis } from "../api/aiApi";
import { analyzeProfileLocally } from "../utils/aiDoctor";

interface Props {
  token: string | null;
  profile?: any;
  onNavigateToProfile?: () => void;
}

const ROLES = [
  "Full-Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "DevOps / Cloud Engineer",
  "Software Engineer (Generalist)",
];

export default function PortfolioDoctor({ token, profile, onNavigateToProfile }: Props) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PortfolioDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [activeTab, setActiveTab] = useState<"prescriptions" | "skills" | "projects" | "recruiter">("prescriptions");
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchDiagnosis = async (targetRole = selectedRole) => {
    if (!token && !profile) return;
    setLoading(true);
    setError(null);
    try {
      if (token) {
        const data = await getPortfolioDiagnosis(token, targetRole);
        if (data.success && data.diagnosis) {
          setDiagnosis(data.diagnosis);
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn("Backend AI Diagnosis returned error, attempting self-healing client fallback:", err);
    }

    // Resilient Fallback: If backend is 404/updating/sleeping, compute directly from profile
    if (profile) {
      try {
        const localDiag = analyzeProfileLocally(profile, targetRole);
        setDiagnosis(localDiag);
        setError(null);
      } catch (localErr: any) {
        console.error("Local diagnosis error:", localErr);
        setError("Could not analyze portfolio.");
      }
    } else {
      setError("Failed to connect to AI Portfolio Doctor.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token || profile) {
      fetchDiagnosis(selectedRole);
    }
  }, [token, profile]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    fetchDiagnosis(role);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 55) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 85) return "stroke-emerald-500";
    if (score >= 70) return "stroke-blue-500";
    if (score >= 55) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                AI Career Intelligence
              </span>
              {diagnosis && (
                <span className="text-xs text-slate-400">
                  {diagnosis.aiMode === "gemini" ? "• Powered by Gemini AI" : "• Heuristic Diagnostics"}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold flex items-center gap-3">
              AI Portfolio Doctor
              <span className="text-xl">🩺</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Real-time audit of your developer profile, project impact, and skill synergy to maximize recruiter callbacks.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
              <Target className="w-4 h-4 text-slate-400 mr-2" />
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={loading}
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer pr-2"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchDiagnosis(selectedRole)}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Diagnosing..." : "Re-Analyze"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8">
        {loading && !diagnosis && (
          <div className="py-16 text-center">
            <div className="inline-block relative mb-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Auditing Developer Profile...</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Scanning bio quality, verifying project action verbs & metrics, and analyzing skill synergy against {selectedRole} standards.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-4">
            <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-rose-900">Diagnosis Unavailable</h3>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
            <button
              onClick={() => fetchDiagnosis(selectedRole)}
              className="mt-4 bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-rose-700"
            >
              Retry Analysis
            </button>
          </div>
        )}

        {diagnosis && (
          <div>
            {/* Top Overview: Health Score & 4 Pillars */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch mb-8">
              {/* Score Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Portfolio Health Score
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getScoreColor(diagnosis.overallScore)}`}>
                    Grade: {diagnosis.grade}
                  </span>
                </div>

                <div className="flex items-center gap-6 my-2">
                  {/* Circular Score Gauge */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-slate-200"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`${getScoreRingColor(diagnosis.overallScore)} transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - diagnosis.overallScore / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 leading-none">
                        {diagnosis.overallScore}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{diagnosis.verdict}</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Evaluated against real tech recruiter screening patterns for <strong className="text-slate-800">{selectedRole}</strong>.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Target Role Fit:</span>
                  <span className="font-semibold text-indigo-900 bg-indigo-100/60 px-2.5 py-0.5 rounded-lg">
                    {diagnosis.targetRoleInsights.currentFit[0] || selectedRole}
                  </span>
                </div>
              </div>

              {/* 4 Diagnostic Pillars */}
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-600" />
                      Content Depth & Bio
                    </span>
                    <span className="font-bold text-slate-900">{diagnosis.breakdown.contentDepth}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-700" style={{ width: `${diagnosis.breakdown.contentDepth}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Evaluation of elevator pitch, clarity, and education history.</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      Impact & Metrics (STAR)
                    </span>
                    <span className="font-bold text-slate-900">{diagnosis.breakdown.impactScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${diagnosis.breakdown.impactScore}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Active verbs, quantifiable outcomes, and challenge-action-results.</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      Skill Synergy
                    </span>
                    <span className="font-bold text-slate-900">{diagnosis.breakdown.skillSynergy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-700" style={{ width: `${diagnosis.breakdown.skillSynergy}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">End-to-end stack coherence (Frontend, Backend, DB, DevOps).</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Recruiter Proof-of-Work
                    </span>
                    <span className="font-bold text-slate-900">{diagnosis.breakdown.recruiterReadiness}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-700" style={{ width: `${diagnosis.breakdown.recruiterReadiness}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Working live demo links, public GitHub code, and completeness.</p>
                </div>
              </div>
            </div>

            {/* Quick Strengths & Weaknesses Pillows */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Strengths Detected
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {diagnosis.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4.5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Critical Gaps & Vulnerabilities
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-900">
                  {diagnosis.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 shrink-0 font-bold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "prescriptions"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Action Plan ({diagnosis.recommendations.length})
              </button>

              <button
                onClick={() => setActiveTab("skills")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "skills"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layers className="w-4 h-4" />
                Skill Synergy & Gaps
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "projects"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Code className="w-4 h-4" />
                Project Audits ({diagnosis.projectAudits.length})
              </button>

              <button
                onClick={() => setActiveTab("recruiter")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "recruiter"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Target className="w-4 h-4" />
                Recruiter Strategy
              </button>
            </div>

            {/* Tab 1: Action Plan / Recommendations */}
            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {diagnosis.recommendations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No critical recommendations! Your portfolio is in top-tier shape.
                  </div>
                ) : (
                  diagnosis.recommendations.map((rec) => {
                    const isExpanded = expandedRecId === rec.id;
                    const priorityBadge =
                      rec.priority === "High"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : rec.priority === "Medium"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-emerald-100 text-emerald-700 border-emerald-200";

                    return (
                      <div
                        key={rec.id}
                        className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                                {rec.priority} Priority
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {rec.category}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900 mt-1">{rec.title}</h4>
                            <p className="text-xs text-slate-600">{rec.description}</p>
                          </div>

                          {rec.example && (
                            <button
                              onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 pt-1"
                            >
                              {isExpanded ? "Hide Example" : "View Example"}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        {/* Collapsible Example */}
                        {isExpanded && rec.example && (
                          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3.5 rounded-xl">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                              <span>✨ Senior Engineer Template / Example:</span>
                            </div>
                            <p className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                              "{rec.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {onNavigateToProfile && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={onNavigateToProfile}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-md"
                    >
                      Open Profile Editor to Apply Improvements
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Skill Synergy & Gaps */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Stack Detected */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Detected Competencies by Tier
                    </h4>

                    <div className="space-y-3">
                      {Object.entries(diagnosis.skillGaps.detected).map(([category, list]) => {
                        if (list.length === 0) return null;
                        return (
                          <div key={category}>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 capitalize">
                              {category}
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {list.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-lg"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* High Value Skills to Learn */}
                  <div className="border border-indigo-100 rounded-2xl p-5 bg-indigo-50/30">
                    <h4 className="text-sm font-bold text-indigo-950 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      High-Yield Skills to Boost Market Value
                    </h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Adding 1-2 of these complimentary technologies will round out your technical stack and bypass automated ATS screening filters.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {diagnosis.skillGaps.recommendedToLearn.map((tech, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-indigo-200 shadow-2xs rounded-xl p-2.5 text-xs font-semibold text-indigo-950 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          {tech}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 p-3.5 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700">
                      <span className="font-bold text-indigo-900 block mb-1">Target Next Tier Role:</span>
                      <span>{diagnosis.targetRoleInsights.nextTierRole}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Project Audits */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                {diagnosis.projectAudits.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No projects found on your profile. Add projects in the Profile page to receive an in-depth audit.
                  </div>
                ) : (
                  diagnosis.projectAudits.map((proj, idx) => {
                    const statusBadge =
                      proj.status === "strong"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : proj.status === "needs-improvement"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-rose-100 text-rose-800 border-rose-200";

                    return (
                      <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {proj.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto capitalize ${statusBadge}`}>
                            {proj.status.replace("-", " ")}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1">{proj.feedback}</p>

                        {proj.suggestedRewrite && (
                          <div className="mt-3.5 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                STAR-Method Quantified Rewrite:
                              </span>
                              <button
                                onClick={() => handleCopyText(proj.suggestedRewrite!, idx)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
                              >
                                {copiedIndex === idx ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Rewrite</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-slate-700 font-mono leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                              "{proj.suggestedRewrite}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 4: Recruiter Strategy */}
            {activeTab === "recruiter" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
                  <h4 className="text-base font-bold flex items-center gap-2 mb-2 text-indigo-200">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Senior Recruiter Screening Rubric
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Technical recruiters scan an average portfolio in under 15 seconds. They look for 3 distinct signals:
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <span className="text-indigo-300 text-xs font-bold block mb-1">1. Proof of Execution</span>
                      <p className="text-[11px] text-slate-300">
                        A working live demo URL is 5x more influential than a link to a private or empty repo.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <span className="text-indigo-300 text-xs font-bold block mb-1">2. Quantified Impact</span>
                      <p className="text-[11px] text-slate-300">
                        Replace generic features with numbers: latency reduction, scale, or architecture challenges solved.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <span className="text-indigo-300 text-xs font-bold block mb-1">3. Clear Stack Positioning</span>
                      <p className="text-[11px] text-slate-300">
                        Don't list 25 unrelated technologies. Specialize in one coherent stack (e.g. MERN + TypeScript).
                      </p>
                    </div>
                  </div>
                </div>

                {diagnosis.recruiterTip && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Targeted Recruiter Secret:
                    </h5>
                    <p className="text-xs text-amber-900 font-medium">{diagnosis.recruiterTip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
