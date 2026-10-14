import api from "./axios";

export interface DiagnosticRecommendation {
  id: string;
  category: "Bio" | "Skills" | "Projects" | "General";
  priority: "High" | "Medium" | "Quick Win";
  title: string;
  description: string;
  example?: string;
}

export interface ProjectAuditItem {
  title: string;
  status: "strong" | "needs-improvement" | "critical";
  feedback: string;
  suggestedRewrite?: string;
}

export interface PortfolioDiagnosis {
  overallScore: number;
  grade: string;
  verdict: string;
  breakdown: {
    contentDepth: number;
    impactScore: number;
    skillSynergy: number;
    recruiterReadiness: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: DiagnosticRecommendation[];
  targetRoleInsights: {
    currentFit: string[];
    nextTierRole: string;
    missingSkillsToLevelUp: string[];
  };
  skillGaps: {
    detected: Record<string, string[]>;
    recommendedToLearn: string[];
  };
  projectAudits: ProjectAuditItem[];
  recruiterTip?: string;
  projectCritique?: string;
  aiMode: "gemini" | "heuristic";
  generatedAt: string;
}

export interface DiagnosisResponse {
  success: boolean;
  diagnosis: PortfolioDiagnosis;
}

export const getPortfolioDiagnosis = async (
  token: string,
  targetRole?: string
): Promise<DiagnosisResponse> => {
  const res = await api.post(
    "/ai/diagnose",
    { targetRole },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
