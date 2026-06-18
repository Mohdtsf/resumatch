// ============================================================
// ResuMatch — Application Constants
// ============================================================

/** Maximum file upload size in bytes (3MB) */
export const MAX_FILE_SIZE = 3 * 1024 * 1024;

/** Maximum job description length in characters */
export const MAX_JD_LENGTH = 10000;

/** Accepted MIME types */
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** File extension to type mapping */
export const FILE_EXTENSION_MAP: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Score weight distribution */
export const SCORE_WEIGHTS = {
  keywordMatch: 0.35,
  formatting: 0.20,
  structure: 0.20,
  completeness: 0.15,
  aiEnhancement: 0.10,
} as const;

/** Score thresholds for color coding */
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0,
} as const;

/** Common stop words to filter from keyword extraction */
export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought", "used",
  "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into",
  "through", "during", "before", "after", "above", "below", "between", "out",
  "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "because", "about", "against", "also",
  "up", "down", "if", "it", "its", "we", "they", "them", "their", "this",
  "that", "these", "those", "he", "she", "him", "her", "his", "my", "your",
  "our", "me", "i", "you", "who", "which", "what", "whom", "any", "every",
  "work", "working", "worked", "experience", "experienced", "able", "ability",
  "including", "include", "includes", "required", "requirements", "requirement",
  "strong", "excellent", "good", "great", "best", "well", "etc", "e.g",
  "i.e", "must", "please", "team", "role", "position", "job", "company",
  "looking", "seeking", "responsible", "responsibilities", "qualifications",
  "preferred", "candidate", "ideal", "apply", "opportunity", "join",
]);

export const SECTION_PATTERNS = {
  contact: [
    /\b(contacts?|email|phone|mobile|tel|address|linkedin|github)\b/i,
    /[\w.+-]+@[\w-]+\.[\w.-]+/,  // email pattern
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // phone pattern
  ],
  summary: [
    /\b(summary|objective|profile|about\s*me|professional\s*summary|career\s*objective|executive\s*summary|personal\s*statement)\b/i,
  ],
  experience: [
    /\b(experiences?|employment|work\s*history|professional\s*experience|career\s*history|work\s*experience)\b/i,
  ],
  education: [
    /\b(education|academics?|qualifications?|degrees?|university|college|school|bachelors?|masters?|phd|diplomas?)\b/i,
  ],
  skills: [
    /\b(skills?|technical\s*skills?|competencies|competence|technologies|tools|proficiency|proficiencies|expertise|tech\s*stack|programming|languages)\b/i,
  ],
  certifications: [
    /\b(certifications?|certificates?|licenses?|accreditations?|credentials?|awards?|honors?|achievements?)\b/i,
  ],
  projects: [
    /\b(projects?|portfolio|personal\s*projects?|side\s*projects?|open\s*source)\b/i,
  ],
} as const;

/** ATS-unfriendly patterns to detect */
export const FORMAT_RED_FLAGS = [
  {
    pattern: /\|.*\|.*\|/m,
    issue: "Resume appears to use tables which may not parse correctly in ATS systems",
    severity: "warning" as const,
  },
  {
    pattern: /\t{3,}/,
    issue: "Excessive use of tabs detected — may indicate column layout that breaks ATS parsing",
    severity: "warning" as const,
  },
  {
    pattern: /(.)\1{50,}/,
    issue: "Long repeated characters detected — possible decoration that ATS systems can't read",
    severity: "info" as const,
  },
  {
    pattern: /[^\x00-\x7F]{10,}/,
    issue: "Extended Unicode characters detected — some ATS systems may not handle these correctly",
    severity: "info" as const,
  },
];

/** App metadata */
export const APP_NAME = "ResuMatch";
export const APP_DESCRIPTION = "AI-Powered Resume Analyzer & ATS Score Checker — Get your resume scored against any job description with detailed feedback and improvement suggestions.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Developer info (update with your details) */
export const DEVELOPER_NAME = "Mohd Tauseef Ansari";
export const DEVELOPER_EMAIL = "mohdtauseefansari34@gmail.com";
