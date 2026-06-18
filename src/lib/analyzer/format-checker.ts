// ============================================================
// ResuMatch — ATS Format Checker
// Validates resume formatting for ATS compatibility
// ============================================================

import { FORMAT_RED_FLAGS } from "@/lib/utils/constants";
import type { FormatIssue } from "@/lib/utils/types";

interface FormatCheckResult {
  score: number;       // 0-100
  issues: FormatIssue[];
}

/**
 * Check resume text for ATS-unfriendly formatting patterns.
 * Returns a formatting score and list of issues found.
 */
export function checkFormatting(resumeText: string): FormatCheckResult {
  const issues: FormatIssue[] = [];
  let deductions = 0;

  // ---- Check for known red flags ----
  for (const flag of FORMAT_RED_FLAGS) {
    if (flag.pattern.test(resumeText)) {
      issues.push({
        issue: flag.issue,
        severity: flag.severity as FormatIssue["severity"],
      });
      deductions += flag.severity === "warning" ? 10 : 5;
    }
  }

  // ---- Check text length (too short or too long) ----
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 50) {
    issues.push({
      issue: "Resume appears very short — ATS systems may flag it as incomplete or improperly parsed.",
      severity: "high",
    });
    deductions += 20;
  } else if (wordCount < 100) {
    issues.push({
      issue: "Resume is shorter than typical — consider adding more detail to your experience and skills.",
      severity: "medium",
    });
    deductions += 10;
  } else if (wordCount > 1500) {
    issues.push({
      issue: "Resume is longer than recommended — most ATS systems and recruiters prefer 1-2 page resumes.",
      severity: "low",
    });
    deductions += 5;
  }

  // ---- Check for excessive special characters ----
  const specialCharRatio =
    (resumeText.replace(/[a-zA-Z0-9\s.,;:!?'"()\-\/]/g, "").length) /
    Math.max(resumeText.length, 1);

  if (specialCharRatio > 0.1) {
    issues.push({
      issue: "High ratio of special characters detected — ATS parsers may struggle with non-standard formatting.",
      severity: "medium",
    });
    deductions += 10;
  }

  // ---- Check for all-caps sections (common but ATS varies) ----
  const allCapsLines = resumeText
    .split("\n")
    .filter((line) => line.trim().length > 5 && line.trim() === line.trim().toUpperCase())
    .length;

  if (allCapsLines > 5) {
    issues.push({
      issue: "Multiple all-caps lines detected — while common for headers, excessive caps can hurt readability.",
      severity: "low",
    });
    deductions += 5;
  }

  // ---- Check for very long lines (no line breaks) ----
  const hasNormalParagraphs = resumeText.split("\n").some(
    (line) => line.trim().length > 20 && line.trim().length < 200
  );

  if (!hasNormalParagraphs && wordCount > 50) {
    issues.push({
      issue: "Text appears to lack proper paragraph structure — ensure your resume has clear sections with line breaks.",
      severity: "medium",
    });
    deductions += 10;
  }

  // ---- Positive check: Clean, well-structured text ----
  const hasCleanStructure =
    resumeText.split("\n").filter((l) => l.trim().length > 0).length >= 10;

  if (hasCleanStructure && issues.length === 0) {
    // Bonus for clean formatting
    deductions -= 10;
  }

  const score = Math.min(100, Math.max(0, 100 - deductions));

  return { score, issues };
}
