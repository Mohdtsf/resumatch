// ============================================================
// ResuMatch — Database Queries
// ============================================================

import { eq } from "drizzle-orm";
import { getDB } from "./client";
import { resumeReports, type NewResumeReport } from "./schema";
import type { AnalysisReport, ScoreBreakdown, SectionAnalysis, AISuggestion, FormatIssue } from "@/lib/utils/types";

/**
 * Save an analysis report to the database.
 * Returns the report ID, or null if DB is unavailable.
 */
export async function saveReport(report: Omit<NewResumeReport, "id" | "createdAt" | "expiresAt">): Promise<string | null> {
  const db = getDB();
  if (!db) return null;

  try {
    const [inserted] = await db
      .insert(resumeReports)
      .values(report)
      .returning({ id: resumeReports.id });

    return inserted?.id ?? null;
  } catch (error) {
    console.error("[DB] Failed to save report:", error instanceof Error ? error.message : "Unknown");
    return null;
  }
}

/**
 * Fetch a report by its UUID.
 * Returns null if not found or DB is unavailable.
 */
export async function getReport(id: string): Promise<AnalysisReport | null> {
  const db = getDB();
  if (!db) return null;

  // Validate UUID format to prevent SQL injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return null;

  try {
    const [report] = await db
      .select()
      .from(resumeReports)
      .where(eq(resumeReports.id, id))
      .limit(1);

    if (!report) return null;

    return {
      id: report.id,
      createdAt: report.createdAt.toISOString(),
      targetRole: report.targetRole,
      fileType: report.fileType as "pdf" | "docx",
      atsScore: report.atsScore,
      scoreBreakdown: report.scoreBreakdown as ScoreBreakdown,
      matchedKeywords: report.matchedKeywords as string[],
      missingKeywords: report.missingKeywords as string[],
      sectionAnalysis: report.sectionAnalysis as SectionAnalysis,
      aiSuggestions: report.aiSuggestions as AISuggestion[],
      formatIssues: report.formatIssues as FormatIssue[],
    };
  } catch (error) {
    console.error("[DB] Failed to fetch report:", error instanceof Error ? error.message : "Unknown");
    return null;
  }
}
