// ============================================================
// ResuMatch — POST /api/analyze
// Main analysis endpoint
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateFile } from "@/lib/security/file-validator";
import { sanitizeText } from "@/lib/security/input-sanitizer";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { parseResume } from "@/lib/analyzer/parser";
import { runRuleBasedAnalysis } from "@/lib/analyzer/scorer";
import { buildScoreBreakdown, calculateOverallScore } from "@/lib/analyzer/scorer";
import { analyzeWithGemini } from "@/lib/ai/gemini";
import { saveReport } from "@/lib/db/queries";
import { MAX_FILE_SIZE, MAX_JD_LENGTH } from "@/lib/utils/constants";
import type { AISuggestion } from "@/lib/utils/types";
import { nanoid } from "nanoid";

// Input validation schema
const AnalyzeInputSchema = z.object({
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(MAX_JD_LENGTH, `Job description must be under ${MAX_JD_LENGTH} characters`),
});

export async function POST(request: NextRequest) {
  try {
    // ---- 1. Rate Limiting ----
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "anonymous";

    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please wait a few minutes before trying again.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // ---- 2. Parse multipart form data ----
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!resumeFile) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_FILE", message: "Please upload a resume file (PDF or DOCX)." },
        },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_JD", message: "Please provide a job description." },
        },
        { status: 400 }
      );
    }

    // ---- 3. Validate job description ----
    const jdValidation = AnalyzeInputSchema.safeParse({ jobDescription });
    if (!jdValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JD",
            message: jdValidation.error.issues[0]?.message || "Invalid job description.",
          },
        },
        { status: 400 }
      );
    }

    const sanitizedJD = sanitizeText(jdValidation.data.jobDescription);

    // ---- 4. Validate file (magic bytes + size) ----
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
          },
        },
        { status: 413 }
      );
    }

    const fileValidation = validateFile(fileBuffer, resumeFile.name);
    if (!fileValidation.valid || !fileValidation.fileType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_TYPE",
            message: fileValidation.error || "Only PDF and DOCX files are accepted.",
          },
        },
        { status: 415 }
      );
    }

    // ---- 5. Extract text from resume ----
    let resumeText: string;
    try {
      resumeText = await parseResume(fileBuffer, fileValidation.fileType);
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PARSE_ERROR",
            message: parseError instanceof Error
              ? parseError.message
              : "Failed to extract text from the resume file.",
          },
        },
        { status: 422 }
      );
    }

    // ---- 6. Rule-based analysis ----
    const ruleAnalysis = runRuleBasedAnalysis(resumeText, sanitizedJD);

    // ---- 7. AI enhancement (non-blocking — tool works without it) ----
    const aiResult = await analyzeWithGemini(resumeText, sanitizedJD, ruleAnalysis);

    // ---- 8. Build final scores ----
    const aiScoreAdjustment = aiResult?.aiScoreAdjustment ?? 0;
    const scoreBreakdown = buildScoreBreakdown(ruleAnalysis, aiScoreAdjustment);
    const atsScore = calculateOverallScore(scoreBreakdown);

    // Build suggestions (AI + rule-based format issues as suggestions)
    const suggestions: AISuggestion[] = [
      ...(aiResult?.suggestions ?? []),
    ];

    // Add rule-based suggestions for missing sections
    if (!ruleAnalysis.sectionAnalysis.summary) {
      suggestions.push({
        category: "Structure",
        severity: "medium",
        suggestion: "Add a Professional Summary section at the top of your resume. A 2-3 sentence summary helps ATS systems and recruiters quickly understand your profile.",
      });
    }
    if (!ruleAnalysis.sectionAnalysis.skills) {
      suggestions.push({
        category: "Keywords",
        severity: "high",
        suggestion: "Add a dedicated Skills section to your resume. ATS systems scan for a dedicated skills section to match against job requirements.",
      });
    }
    if (ruleAnalysis.missingKeywords.length > 3) {
      suggestions.push({
        category: "Keywords",
        severity: "high",
        suggestion: `Your resume is missing ${ruleAnalysis.missingKeywords.length} keywords from the job description. Consider adding: ${ruleAnalysis.missingKeywords.slice(0, 5).join(", ")}.`,
      });
    }

    // ---- 9. Save to database ----
    const targetRole = aiResult?.roleMatch ?? null;

    const reportId = await saveReport({
      targetRole,
      fileType: fileValidation.fileType,
      atsScore,
      scoreBreakdown,
      matchedKeywords: ruleAnalysis.matchedKeywords,
      missingKeywords: ruleAnalysis.missingKeywords,
      aiSuggestions: suggestions,
      sectionAnalysis: ruleAnalysis.sectionAnalysis,
      formatIssues: ruleAnalysis.formatIssues,
    });

    // If DB save failed, generate a fallback ID
    const finalId = reportId || nanoid(21);

    // If no DB, store in response directly for client-side rendering
    if (!reportId) {
      return NextResponse.json({
        success: true,
        reportId: finalId,
        redirectUrl: `/report/${finalId}`,
        // Include full report data since it's not in DB
        inlineReport: {
          id: finalId,
          createdAt: new Date().toISOString(),
          targetRole,
          fileType: fileValidation.fileType,
          atsScore,
          scoreBreakdown,
          matchedKeywords: ruleAnalysis.matchedKeywords,
          missingKeywords: ruleAnalysis.missingKeywords,
          sectionAnalysis: ruleAnalysis.sectionAnalysis,
          aiSuggestions: suggestions,
          formatIssues: ruleAnalysis.formatIssues,
        },
      });
    }

    return NextResponse.json({
      success: true,
      reportId: finalId,
      redirectUrl: `/report/${finalId}`,
    });
  } catch (error) {
    // Never log resume content in errors
    console.error("[Analyze API] Unhandled error:", error instanceof Error ? error.message : "Unknown");

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
