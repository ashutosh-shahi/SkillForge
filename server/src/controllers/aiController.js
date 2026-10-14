/**
 * AI Portfolio Doctor Diagnostic Engine
 * Analyzes developer profiles (bio, skills, education, projects)
 * Features role-aware benchmarks, weighted scoring, and optional Gemini LLM enrichment.
 */

const User = require("../models/User");

// Industry standard action verbs for STAR methodology
const ACTION_VERBS = [
  "built", "developed", "architected", "engineered", "designed", "implemented",
  "created", "launched", "optimized", "scaled", "automated", "refactored",
  "deployed", "integrated", "spearheaded", "orchestrated", "reduced", "increased",
  "migrated", "enhanced", "configured", "maintained", "accelerated", "solved"
];

// Metrics indicator patterns (numbers, percentages, latencies, multipliers)
const METRIC_PATTERNS = [
  /\b\d+%\b/,                   // e.g. 40%, 99.9%
  /\b\d+\s*(ms|s|sec|min)\b/i,   // e.g. 200ms, 2s
  /\b\d+x\b/i,                  // e.g. 10x, 2x
  /\b\d+\+?\s*(users|requests|reqs|downloads|qps|rps|stars|views|clients)\b/i,
  /\b(reduced|increased|boosted|improved|accelerated)\b.*\bby\b.*\d+/i,
  /\b\$\d+/                     // e.g. $10k
];

// High-value technology stacks for categorization
const TECH_ECOSYSTEM = {
  frontend: ["react", "vue", "angular", "next.js", "nextjs", "svelte", "html", "css", "tailwind", "redux", "zustand", "sass"],
  backend: ["node", "nodejs", "express", "django", "fastapi", "spring", "nestjs", "flask", "go", "golang", "ruby"],
  database: ["mongodb", "postgresql", "postgres", "mysql", "redis", "dynamodb", "sqlite", "cassandra", "prisma", "mongoose"],
  devops: ["docker", "kubernetes", "k8s", "aws", "azure", "gcp", "ci/cd", "github actions", "linux", "nginx", "terraform", "bash"],
  languages: ["javascript", "typescript", "python", "java", "c++", "cpp", "go", "golang", "rust", "c#", "php"],
  testing: ["jest", "mocha", "cypress", "playwright", "vitest", "junit", "pytest"]
};

// Role-specific evaluation profiles
const ROLE_PROFILES = {
  "Frontend Engineer": {
    target: "Frontend Engineer",
    criticalSkills: ["javascript", "react", "html", "css", "vue", "angular", "next.js"],
    recommendedSkills: ["typescript", "tailwind", "zustand", "redux", "jest", "vitest", "responsive design"],
    requiredCats: ["frontend"],
    weights: { depth: 0.20, impact: 0.25, synergy: 0.35, readiness: 0.20 },
    missingTips: ["TypeScript", "Tailwind CSS", "Jest/Vitest", "Next.js"],
    roleDescription: "building high-performance, accessible, and responsive user interfaces"
  },
  "Backend Engineer": {
    target: "Backend Engineer",
    criticalSkills: ["node", "express", "django", "fastapi", "spring", "nestjs", "python", "java", "go", "mongodb", "postgresql", "mysql"],
    recommendedSkills: ["redis", "postgresql", "docker", "jwt", "rest api", "testing", "microservices"],
    requiredCats: ["backend", "database"],
    weights: { depth: 0.20, impact: 0.30, synergy: 0.35, readiness: 0.15 },
    missingTips: ["PostgreSQL / SQL", "Redis Caching", "Docker Containerization", "API Integration Testing"],
    roleDescription: "designing robust REST APIs, database schemas, and scalable server architecture"
  },
  "DevOps / Cloud Engineer": {
    target: "DevOps / Cloud Engineer",
    criticalSkills: ["docker", "kubernetes", "k8s", "aws", "azure", "gcp", "ci/cd", "github actions", "linux", "terraform", "nginx"],
    recommendedSkills: ["terraform", "bash", "prometheus", "grafana", "nginx", "helm", "ansible"],
    requiredCats: ["devops"],
    weights: { depth: 0.15, impact: 0.30, synergy: 0.40, readiness: 0.15 },
    missingTips: ["Docker", "Kubernetes", "AWS / Cloud Infrastructure", "CI/CD Pipelines", "Linux Shell"],
    roleDescription: "automating cloud deployments, CI/CD pipelines, and scalable container orchestration"
  },
  "Full-Stack Developer": {
    target: "Full-Stack Developer",
    criticalSkills: ["react", "node", "express", "mongodb", "javascript", "typescript", "html", "css", "postgresql"],
    recommendedSkills: ["typescript", "docker", "redis", "tailwind", "rest api", "ci/cd"],
    requiredCats: ["frontend", "backend"],
    weights: { depth: 0.20, impact: 0.25, synergy: 0.35, readiness: 0.20 },
    missingTips: ["TypeScript", "Docker", "Redis", "Database Optimization"],
    roleDescription: "delivering complete end-to-end web applications across UI, API, and persistence layers"
  },
  "Software Engineer (Generalist)": {
    target: "Software Engineer (Generalist)",
    criticalSkills: ["c++", "cpp", "java", "python", "javascript", "typescript", "go", "golang", "c#", "git"],
    recommendedSkills: ["data structures", "algorithms", "system design", "sql", "git", "linux"],
    requiredCats: ["languages"],
    weights: { depth: 0.25, impact: 0.25, synergy: 0.30, readiness: 0.20 },
    missingTips: ["Data Structures & Algorithms", "System Design", "Git Version Control", "Relational SQL"],
    roleDescription: "core computer science problem-solving, clean code architectures, and multi-language versatility"
  }
};

/**
 * Role-Aware Heuristic Analyzer
 */
function analyzeProfileHeuristically(profile, targetRole = "Full-Stack Developer") {
  const roleKey = ROLE_PROFILES[targetRole] ? targetRole : "Full-Stack Developer";
  const roleConfig = ROLE_PROFILES[roleKey];

  const bio = (profile.bio || "").trim();
  const skills = Array.isArray(profile.skills) ? profile.skills.map(s => s.toLowerCase().trim()) : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const education = Array.isArray(profile.education) ? profile.education : [];

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  const projectAudits = [];

  // Categorize declared skills
  const detectedCategories = {
    frontend: [],
    backend: [],
    database: [],
    devops: [],
    languages: [],
    testing: []
  };

  skills.forEach(skill => {
    for (const [cat, items] of Object.entries(TECH_ECOSYSTEM)) {
      if (items.some(i => skill.includes(i) || i.includes(skill))) {
        if (!detectedCategories[cat].includes(skill)) {
          detectedCategories[cat].push(skill);
        }
      }
    }
  });

  // --- 1. Bio & Elevator Pitch (Content Depth) ---
  let contentDepth = 0;
  if (!bio) {
    weaknesses.push(`Missing Professional Bio: Your profile lacks an introduction highlighting your fit for ${targetRole} positions.`);
    recommendations.push({
      id: "rec-bio-1",
      category: "Bio",
      priority: "High",
      title: `Write an elevator pitch tailored to ${targetRole}`,
      description: `State your primary stack and specify that you build software focused on ${roleConfig.roleDescription}.`,
      example: `${targetRole} with hands-on experience building scalable applications. Focused on clean architecture, performance, and modern developer tooling.`
    });
  } else if (bio.length < 50) {
    contentDepth = 45;
    weaknesses.push(`Brief Bio: Your bio is under 50 characters, leaving hiring managers guessing about your engineering focus.`);
    recommendations.push({
      id: "rec-bio-2",
      category: "Bio",
      priority: "Medium",
      title: "Expand your bio with key engineering strengths",
      description: `Highlight your preferred technologies and what sets your approach to ${targetRole} work apart.`
    });
  } else {
    contentDepth = 80;
    // Check for target role keyword in bio
    const bioLower = bio.toLowerCase();
    const roleWords = targetRole.toLowerCase().split(/[\s/]+/);
    const mentionsRole = roleWords.some(w => w.length > 3 && bioLower.includes(w));
    if (mentionsRole) {
      contentDepth = 100;
      strengths.push(`Bio clearly articulates your focus on ${targetRole} responsibilities.`);
    } else {
      contentDepth = 85;
      strengths.push("Professional summary established on profile.");
    }
  }

  // --- 2. Role Synergy & Skill Match (Pillar 2) ---
  let skillSynergy = 0;
  
  // A. Critical Skills Match for the Selected Role
  const matchedCritical = roleConfig.criticalSkills.filter(cs =>
    skills.some(userSkill => userSkill.includes(cs) || cs.includes(userSkill))
  );
  const criticalRatio = Math.min(1, matchedCritical.length / Math.min(roleConfig.criticalSkills.length, 3));

  // B. Required Category Presence
  const categoriesPresent = roleConfig.requiredCats.filter(cat =>
    detectedCategories[cat] && detectedCategories[cat].length > 0
  );
  const catRatio = roleConfig.requiredCats.length > 0
    ? categoriesPresent.length / roleConfig.requiredCats.length
    : 1;

  // C. Recommended / Bonus Skills Match
  const matchedBonus = roleConfig.recommendedSkills.filter(bs =>
    skills.some(userSkill => userSkill.includes(bs) || bs.includes(userSkill))
  );
  const bonusScore = Math.min(25, matchedBonus.length * 8);

  // Compute Skill Synergy Score for this specific role
  skillSynergy = Math.round((criticalRatio * 45) + (catRatio * 35) + bonusScore);
  skillSynergy = Math.max(5, Math.min(100, skillSynergy));

  if (skills.length === 0) {
    skillSynergy = 0;
    weaknesses.push(`No skills listed. Immediate rejection by ATS filters for ${targetRole} positions.`);
  } else if (criticalRatio === 0) {
    weaknesses.push(`Critical Stack Disconnect: You selected '${targetRole}', but your profile lists zero core ${targetRole} technologies.`);
    recommendations.push({
      id: "rec-role-critical",
      category: "Skills",
      priority: "High",
      title: `Acquire foundational skills for ${targetRole}`,
      description: `Recruiters for ${targetRole} require at least 2 of: ${roleConfig.criticalSkills.slice(0, 4).join(", ")}.`,
      example: `Target to learn: ${roleConfig.missingTips.slice(0, 3).join(", ")}`
    });
  } else if (criticalRatio >= 0.7 && catRatio === 1) {
    strengths.push(`Strong technology alignment: You possess core ${targetRole} tools (${matchedCritical.join(", ")}).`);
  } else {
    strengths.push(`Partial foundation for ${targetRole} detected (${matchedCritical.join(", ")}).`);
    weaknesses.push(`Missing key complementary tools required in modern ${targetRole} job descriptions.`);
  }

  // Missing high-yield skills for this target role
  const recommendedToLearn = roleConfig.missingTips.filter(tip =>
    !skills.some(s => s.includes(tip.toLowerCase()))
  );

  // --- 3. Projects Quality & Role Impact (Pillar 3) ---
  let impactScore = 0;
  let metricsCount = 0;
  let missingLinksCount = 0;

  if (projects.length === 0) {
    impactScore = 0;
    weaknesses.push(`No projects listed: Practical proof-of-work is mandatory when applying for ${targetRole} roles.`);
    recommendations.push({
      id: "rec-proj-0",
      category: "Projects",
      priority: "High",
      title: `Publish at least 1 showcase project for ${targetRole}`,
      description: `Build and document an application that demonstrates ${roleConfig.roleDescription}.`
    });
  } else {
    projects.forEach((proj, idx) => {
      const desc = (proj.description || "").trim();
      const hasGithub = Boolean(proj.githubUrl && proj.githubUrl.trim());
      const hasLive = Boolean(proj.liveUrl && proj.liveUrl.trim());
      const hasTech = Array.isArray(proj.technologies) && proj.technologies.length > 0;

      const projectIssues = [];
      const hasActionVerb = ACTION_VERBS.some(v => new RegExp(`\\b${v}\\b`, "i").test(desc));
      const hasMetric = METRIC_PATTERNS.some(pattern => pattern.test(desc));

      if (hasMetric) metricsCount++;

      if (!hasGithub) {
        projectIssues.push("Missing GitHub repository link");
        missingLinksCount++;
      }
      
      // Live demo is extra critical for Frontend & Full-Stack
      if (!hasLive) {
        if (targetRole === "Frontend Engineer" || targetRole === "Full-Stack Developer") {
          projectIssues.push("Missing live deployed demo (crucial for UI evaluation)");
          missingLinksCount += 1.5;
        } else {
          projectIssues.push("Missing live demo URL");
          missingLinksCount++;
        }
      }

      if (!hasActionVerb) {
        projectIssues.push("Lacks active engineering verbs ('Architected', 'Engineered')");
      }
      if (!hasMetric) {
        projectIssues.push("Lacks measurable impact (latency, throughput, users, or performance numbers)");
      }

      let auditStatus = "strong";
      if (projectIssues.length >= 3) auditStatus = "critical";
      else if (projectIssues.length >= 1) auditStatus = "needs-improvement";

      const techList = hasTech ? proj.technologies.join(", ") : "modern software stack";
      const suggestedRewrite = `Architected and deployed ${proj.title || "the application"} using ${techList}; implemented robust ${targetRole} workflows with secure data persistence, achieving responsive sub-200ms API response times.`;

      projectAudits.push({
        title: proj.title || `Project #${idx + 1}`,
        status: auditStatus,
        feedback: projectIssues.length === 0
          ? `Outstanding project presentation demonstrating ${targetRole} proficiencies.`
          : `Improvement areas: ${projectIssues.join(", ")}.`,
        suggestedRewrite: auditStatus !== "strong" ? suggestedRewrite : undefined
      });
    });

    // Base project score
    let baseProjPoints = Math.min(50, projects.length * 25);
    let linkDeductions = Math.min(30, missingLinksCount * 12);
    let metricBonus = metricsCount > 0 ? 30 : 0;

    impactScore = Math.max(0, Math.min(100, baseProjPoints - linkDeductions + metricBonus));

    if (missingLinksCount > 0) {
      weaknesses.push(`${Math.round(missingLinksCount)} project links missing. Recruiters need one-click access to code and live demos.`);
      recommendations.push({
        id: "rec-proj-links",
        category: "Projects",
        priority: "High",
        title: "Add live demo and source code links",
        description: `Deploy your projects on Vercel or Render. Demonstrating live working software accelerates interview invitations.`
      });
    }

    if (metricsCount === 0) {
      weaknesses.push("Project descriptions explain 'what the app does' rather than 'what engineering challenge you solved'.");
      recommendations.push({
        id: "rec-proj-metrics",
        category: "Projects",
        priority: "High",
        title: "Quantify your technical achievements (STAR Method)",
        description: "Add quantifiable metrics: e.g. 'Optimized bundle size by 30%', 'Handled 500 concurrent mock queries', or 'Reduced query time to 50ms'."
      });
    } else {
      strengths.push("Projects highlight quantified technical problem solving and impact.");
    }
  }

  // --- 4. Recruiter Proof-of-Work & Education (Pillar 4) ---
  let recruiterReadiness = 0;
  if (education.length > 0) {
    recruiterReadiness += 40;
    strengths.push(`Educational background verified (${education[0].degree || "Degree"} at ${education[0].institution || "Institution"}).`);
  } else {
    weaknesses.push("No academic credentials or formal degree listed.");
    recommendations.push({
      id: "rec-edu-1",
      category: "General",
      priority: "Medium",
      title: "Add your educational degree and graduation timeline",
      description: "Automated recruiter screening filters check for degree completion and university background."
    });
  }

  if (projects.length >= 2 && skills.length >= 4 && bio.length >= 40) {
    recruiterReadiness += 60;
  } else if (projects.length >= 1 && skills.length >= 3) {
    recruiterReadiness += 35;
  } else {
    recruiterReadiness += 10;
  }
  recruiterReadiness = Math.min(100, recruiterReadiness);

  // --- 5. Role-Weighted Overall Score (0-100) ---
  const weights = roleConfig.weights;
  const overallScore = Math.round(
    contentDepth * weights.depth +
    impactScore * weights.impact +
    skillSynergy * weights.synergy +
    recruiterReadiness * weights.readiness
  );

  // Grade & Verdict specifically calibrated to the chosen role
  let grade = "C";
  let verdict = `Early Stage Profile for ${targetRole}`;

  if (overallScore >= 85) {
    grade = "A+";
    verdict = `Highly Competitive for ${targetRole} Positions`;
  } else if (overallScore >= 75) {
    grade = "A-";
    verdict = `Solid Technical Foundation for ${targetRole}`;
  } else if (overallScore >= 60) {
    grade = "B+";
    verdict = `Promising Candidate with High-Impact Opportunities`;
  } else if (overallScore >= 45) {
    grade = "B-";
    verdict = `Developing Profile needing ${targetRole} Stack Polish`;
  } else if (overallScore >= 30) {
    grade = "C";
    verdict = `Partial Alignment: Gaps in Core ${targetRole} Stack`;
  } else {
    grade = "D";
    verdict = `Significant Stack Disconnect for ${targetRole} Roles`;
  }

  // Dynamic Current Fit & Next Tier Role
  const hasFrontend = detectedCategories.frontend.length > 0;
  const hasBackend = detectedCategories.backend.length > 0;
  const hasDevops = detectedCategories.devops.length > 0;

  const currentFit = [];
  if (hasFrontend && hasBackend) currentFit.push("Full-Stack Developer (MERN)", "Junior Software Engineer");
  else if (hasFrontend) currentFit.push("Frontend Engineer", "React Developer");
  else if (hasBackend) currentFit.push("Backend Engineer", "API Developer");
  else currentFit.push("Junior Software Engineer", "Web Developer");

  if (!currentFit.includes(targetRole) && skillSynergy >= 45) {
    currentFit.unshift(targetRole);
  }

  const nextTierRole = hasDevops
    ? `Senior ${targetRole}`
    : `Mid-Level ${targetRole}`;

  return {
    overallScore,
    grade,
    verdict,
    breakdown: {
      contentDepth,
      impactScore,
      skillSynergy,
      recruiterReadiness
    },
    strengths: strengths.length > 0 ? strengths : [`Developer profile registered on SkillForge.`],
    weaknesses: weaknesses.length > 0 ? weaknesses : [`Add live production deployments to reach 90%+ score.`],
    recommendations,
    targetRoleInsights: {
      currentFit,
      nextTierRole,
      missingSkillsToLevelUp: recommendedToLearn.length > 0 ? recommendedToLearn.slice(0, 4) : ["System Design", "Docker", "Redis"]
    },
    skillGaps: {
      detected: detectedCategories,
      recommendedToLearn: recommendedToLearn.slice(0, 5)
    },
    projectAudits,
    aiMode: "heuristic",
    generatedAt: new Date().toISOString()
  };
}

/**
 * Optional Gemini API Enrichment
 */
async function enrichWithGemini(profile, heuristicDiagnosis, targetRole) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return heuristicDiagnosis;

  try {
    const prompt = `You are a Senior Technical Recruiter evaluating a candidate specifically for the role of '${targetRole}'.
Candidate Profile:
Name: ${profile.name}
Bio: ${profile.bio || "None"}
Skills: ${(profile.skills || []).join(", ")}
Projects: ${JSON.stringify(profile.projects || [])}
Education: ${JSON.stringify(profile.education || [])}

The role-calibrated score for '${targetRole}' is ${heuristicDiagnosis.overallScore}/100 (Grade: ${heuristicDiagnosis.grade}).
Skill synergy for this role: ${heuristicDiagnosis.breakdown.skillSynergy}%.

Provide a strictly valid JSON response (no markdown, no backticks, no code fence):
{
  "verdict": "2-sentence punchy evaluation of how well their stack matches a ${targetRole}",
  "aiStrengths": ["Strength 1 tailored to ${targetRole}", "Strength 2"],
  "aiWeaknesses": ["Weakness 1 tailored to ${targetRole}", "Weakness 2"],
  "recruiterTip": "One specific insider tip for landing ${targetRole} interviews with their current profile",
  "projectCritique": "One specific advice on how their projects could better highlight ${targetRole} expertise"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) return heuristicDiagnosis;

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return heuristicDiagnosis;

    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      ...heuristicDiagnosis,
      verdict: parsed.verdict || heuristicDiagnosis.verdict,
      strengths: Array.isArray(parsed.aiStrengths) && parsed.aiStrengths.length > 0 ? parsed.aiStrengths : heuristicDiagnosis.strengths,
      weaknesses: Array.isArray(parsed.aiWeaknesses) && parsed.aiWeaknesses.length > 0 ? parsed.aiWeaknesses : heuristicDiagnosis.weaknesses,
      recruiterTip: parsed.recruiterTip,
      projectCritique: parsed.projectCritique,
      aiMode: "gemini"
    };
  } catch (err) {
    console.warn("Gemini enrichment failed gracefully:", err.message);
    return heuristicDiagnosis;
  }
}

/**
 * Controller endpoint: GET or POST /api/ai/diagnose
 */
const getPortfolioDiagnosis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const targetRole = req.body?.targetRole || req.query?.targetRole || "Full-Stack Developer";
    
    // 1. Run role-aware heuristic diagnosis
    const heuristicResult = analyzeProfileHeuristically(user, targetRole);

    // 2. Optionally enrich with Gemini
    const finalDiagnosis = await enrichWithGemini(user, heuristicResult, targetRole);

    res.status(200).json({
      success: true,
      diagnosis: finalDiagnosis
    });
  } catch (error) {
    console.error("AI Doctor Diagnosis Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate portfolio diagnosis"
    });
  }
};

module.exports = {
  getPortfolioDiagnosis,
  analyzeProfileHeuristically
};
