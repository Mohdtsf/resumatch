// ============================================================
// ResuMatch — Drizzle ORM Schema (Neon Postgres)
// ============================================================

import { pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const resumeReports = pgTable(
  "resume_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull().$defaultFn(
      () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    ),

    // Metadata (no PII)
    targetRole: text("target_role"),
    fileType: text("file_type").notNull(), // 'pdf' | 'docx'

    // Scores
    atsScore: integer("ats_score").notNull(),
    scoreBreakdown: jsonb("score_breakdown").notNull(),

    // Keyword Analysis
    matchedKeywords: jsonb("matched_keywords").notNull(),
    missingKeywords: jsonb("missing_keywords").notNull(),

    // AI Analysis
    aiSuggestions: jsonb("ai_suggestions").notNull(),
    sectionAnalysis: jsonb("section_analysis").notNull(),

    // Formatting
    formatIssues: jsonb("format_issues").notNull().default([]),
  },
  (table) => [
    index("idx_reports_expires_at").on(table.expiresAt),
    index("idx_reports_created_at").on(table.createdAt),
  ]
);

// Type inference
export type ResumeReport = typeof resumeReports.$inferSelect;
export type NewResumeReport = typeof resumeReports.$inferInsert;
