// ============================================================
// ResuMatch — Resume Section Detector
// Identifies standard resume sections
// ============================================================

import { SECTION_PATTERNS } from "@/lib/utils/constants";
import type { SectionAnalysis } from "@/lib/utils/types";

/**
 * Detect which standard resume sections are present.
 * Uses regex patterns to identify section headers and content indicators.
 */
export function detectSections(resumeText: string): SectionAnalysis {
  const result: SectionAnalysis = {
    contact: false,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    certifications: false,
    projects: false,
  };

  for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(resumeText)) {
        result[section as keyof SectionAnalysis] = true;
        break;
      }
    }
  }

  return result;
}

/**
 * Calculate a structure/completeness score based on which sections exist.
 * Essential sections are weighted more heavily.
 */
export function calculateStructureScore(sections: SectionAnalysis): number {
  const weights: Record<keyof SectionAnalysis, number> = {
    contact: 20,      // Essential — must have
    experience: 25,   // Essential
    education: 15,    // Important
    skills: 20,       // Important for ATS
    summary: 10,      // Good to have
    certifications: 5, // Nice to have
    projects: 5,      // Nice to have
  };

  let score = 0;
  let maxScore = 0;

  for (const [section, weight] of Object.entries(weights)) {
    maxScore += weight;
    if (sections[section as keyof SectionAnalysis]) {
      score += weight;
    }
  }

  return Math.round((score / maxScore) * 100);
}

/**
 * Calculate completeness score based on content quality signals.
 */
export function calculateCompletenessScore(
  resumeText: string,
  sections: SectionAnalysis
): number {
  let score = 0;

  // Text length check (too short = incomplete, too long = unfocused)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 1200) {
    score += 25; // Ideal range for a 1-2 page resume
  } else if (wordCount >= 100 && wordCount <= 1500) {
    score += 15;
  } else if (wordCount >= 50) {
    score += 5;
  }

  // Has contact info
  if (sections.contact) score += 20;

  // Has quantifiable achievements (numbers, percentages)
  const hasMetrics = /\b\d+[%+]?\b/.test(resumeText) && /\b(increase|decrease|improve|reduc|grow|save|generat|achiev|deliver|manag|led|built|creat|develop)\w*\b/i.test(resumeText);
  if (hasMetrics) score += 20;

  // Has action verbs
  const actionVerbs = /\b(led|managed|developed|built|created|designed|implemented|launched|optimized|automated|architected|deployed|integrated|analyzed|coordinated|established|delivered|streamlined|mentored|spearheaded)\b/i;
  if (actionVerbs.test(resumeText)) score += 15;

  // Has dates/timeline
  const hasDates = /\b(20\d{2}|19\d{2})\b/.test(resumeText) || /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}\b/i.test(resumeText);
  if (hasDates) score += 10;

  // Has at least 3 essential sections
  const essentialSections = [sections.contact, sections.experience, sections.education, sections.skills];
  const essentialCount = essentialSections.filter(Boolean).length;
  if (essentialCount >= 3) score += 10;

  return Math.min(100, score);
}
