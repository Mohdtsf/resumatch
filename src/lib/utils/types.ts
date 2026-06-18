// ============================================================
// ResuMatch — Shared TypeScript Types
// ============================================================

/** Supported file types for resume upload */
export type FileType = "pdf" | "docx";

/** Severity levels for issues and suggestions */
export type Severity = "critical" | "high" | "medium" | "low" | "info";

/** Score breakdown categories */
export interface ScoreBreakdown {
  keywordMatch: number;    // 0-100
  formatting: number;      // 0-100
  structure: number;       // 0-100
  completeness: number;    // 0-100
  aiEnhancement: number;   // 0-100
}

/** Resume sections that we detect */
export interface SectionAnalysis {
  contact: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  certifications: boolean;
  projects: boolean;
}

/** Individual AI suggestion */
export interface AISuggestion {
  category: string;
  severity: Severity;
  suggestion: string;
}

/** Individual format issue */
export interface FormatIssue {
  issue: string;
  severity: Severity;
}

/** Complete analysis report */
export interface AnalysisReport {
  id: string;
  createdAt: string;
  targetRole: string | null;
  fileType: FileType;
  atsScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionAnalysis: SectionAnalysis;
  aiSuggestions: AISuggestion[];
  formatIssues: FormatIssue[];
}

/** API success response for analysis */
export interface AnalyzeSuccessResponse {
  success: true;
  reportId: string;
  redirectUrl: string;
}

/** API error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** API response for fetching a report */
export interface ReportSuccessResponse {
  success: true;
  report: AnalysisReport;
}

/** Rule-based analysis result (before AI) */
export interface RuleBasedAnalysis {
  keywordScore: number;
  formattingScore: number;
  structureScore: number;
  completenessScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionAnalysis: SectionAnalysis;
  formatIssues: FormatIssue[];
}

/** Gemini AI response shape */
export interface GeminiAnalysisResponse {
  overallImpression: string;
  suggestions: AISuggestion[];
  aiScoreAdjustment: number; // -20 to +20
  roleMatch: string | null;
}
