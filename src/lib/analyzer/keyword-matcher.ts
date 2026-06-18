// ============================================================
// ResuMatch — Keyword Matcher
// TF-IDF inspired keyword extraction and matching
// ============================================================

import { STOP_WORDS } from "@/lib/utils/constants";

interface KeywordResult {
  matchedKeywords: string[];
  missingKeywords: string[];
  score: number; // 0-100
}

/**
 * Extract meaningful keywords from text.
 * Removes stop words, normalizes, and deduplicates.
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    // Replace non-alphanumeric chars (except dots, hyphens, pluses for tech terms)
    .replace(/[^a-z0-9.+#\-\s/]/g, " ")
    // Split on whitespace
    .split(/\s+/)
    // Filter out stop words, short words, and pure numbers
    .filter(
      (word) =>
        word.length >= 2 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word)
    );

  // Also extract multi-word phrases (2-3 word combinations)
  const phrases = extractPhrases(text.toLowerCase());

  // Deduplicate
  return [...new Set([...words, ...phrases])];
}

/**
 * Extract common multi-word technical phrases.
 */
function extractPhrases(text: string): string[] {
  const commonPhrases = [
    // Programming & frameworks
    "machine learning", "deep learning", "data science", "data analysis",
    "data engineering", "web development", "mobile development",
    "full stack", "front end", "back end", "front-end", "back-end",
    "full-stack", "object oriented", "test driven", "continuous integration",
    "continuous delivery", "continuous deployment", "version control",
    "agile methodology", "scrum master", "product management",
    // Cloud & DevOps
    "cloud computing", "amazon web services", "google cloud",
    "microsoft azure", "ci cd", "ci/cd", "dev ops", "devops",
    "site reliability", "infrastructure as code",
    // Specific technologies
    "node.js", "react.js", "vue.js", "angular.js", "next.js",
    "express.js", "nest.js", "react native", "spring boot",
    "ruby on rails", "asp.net", ".net core", "entity framework",
    // Data
    "sql server", "no sql", "nosql", "big data", "data warehouse",
    "power bi", "google analytics",
    // Soft skills
    "project management", "team leadership", "problem solving",
    "communication skills", "time management", "cross functional",
  ];

  const found: string[] = [];
  for (const phrase of commonPhrases) {
    if (text.includes(phrase)) {
      found.push(phrase);
    }
  }
  return found;
}

/**
 * Match resume keywords against job description keywords.
 * Returns matched/missing lists and a score.
 */
export function matchKeywords(
  resumeText: string,
  jobDescriptionText: string
): KeywordResult {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jdKeywords = extractKeywords(jobDescriptionText);

  // Filter JD keywords to only meaningful ones (appear to be specific skills/requirements)
  const importantJdKeywords = jdKeywords.filter((kw) => {
    // Keep technical terms, tools, and specific skill keywords
    return kw.length >= 2;
  });

  // Deduplicate JD keywords
  const uniqueJdKeywords = [...new Set(importantJdKeywords)];

  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of uniqueJdKeywords) {
    // Check exact match or partial match (e.g., "react" matches "reactjs")
    const isMatched =
      resumeKeywords.has(keyword) ||
      [...resumeKeywords].some(
        (rk) =>
          rk.includes(keyword) ||
          keyword.includes(rk) ||
          normalizeKeyword(rk) === normalizeKeyword(keyword)
      );

    if (isMatched) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  // Calculate score
  const total = uniqueJdKeywords.length;
  const score = total > 0 ? Math.round((matched.length / total) * 100) : 50;

  // Cap at reasonable limits (top 20 matched, top 15 missing)
  return {
    matchedKeywords: matched.slice(0, 20),
    missingKeywords: missing.slice(0, 15),
    score: Math.min(100, Math.max(0, score)),
  };
}

/**
 * Normalize a keyword for fuzzy matching.
 * Strips common suffixes and characters.
 */
function normalizeKeyword(keyword: string): string {
  return keyword
    .replace(/[.\-_/+#]/g, "")
    .replace(/js$/, "")
    .replace(/ing$/, "")
    .replace(/tion$/, "")
    .replace(/ment$/, "")
    .replace(/ness$/, "")
    .replace(/ity$/, "")
    .replace(/ly$/, "")
    .replace(/er$/, "")
    .replace(/ed$/, "");
}
