// ============================================================
// ResuMatch — Gemini API Client
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type { GeminiAnalysisResponse, RuleBasedAnalysis } from "@/lib/utils/types";
import { stripPII } from "@/lib/security/pii-stripper";
import { buildAnalysisPrompt } from "./prompts";

// Zod schema to validate Gemini's response
const GeminiResponseSchema = z.object({
  overallImpression: z.string().max(500),
  suggestions: z.array(
    z.object({
      category: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
      suggestion: z.string().max(500),
    })
  ).min(1).max(10),
  aiScoreAdjustment: z.number().min(-20).max(20),
  roleMatch: z.string().nullable(),
});

/**
 * Call Gemini API for AI-enhanced resume analysis.
 * Returns null on any failure — the tool works without AI.
 */
export async function analyzeWithGemini(
  resumeText: string,
  jobDescriptionText: string,
  ruleAnalysis: RuleBasedAnalysis
): Promise<GeminiAnalysisResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("[Gemini] API key not configured — skipping AI analysis");
    return null;
  }

  try {
    // De-identify resume text before sending to Gemini
    const deIdentifiedText = stripPII(resumeText);

    // Build the prompt
    const prompt = buildAnalysisPrompt(deIdentifiedText, jobDescriptionText, ruleAnalysis);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    // Call with timeout (8 seconds — Vercel Hobby functions cap at 10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      clearTimeout(timeout);

      const responseText = result.response.text();

      if (!responseText) {
        console.warn("[Gemini] Empty response received");
        return null;
      }

      // Parse and validate the response
      const parsed = JSON.parse(responseText);
      const validated = GeminiResponseSchema.parse(parsed);

      return {
        overallImpression: validated.overallImpression,
        suggestions: validated.suggestions.map((s) => ({
          category: s.category,
          severity: s.severity,
          suggestion: s.suggestion,
        })),
        aiScoreAdjustment: Math.max(-15, Math.min(15, validated.aiScoreAdjustment)),
        roleMatch: validated.roleMatch,
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    // Log error without sensitive data
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Gemini] Analysis failed: ${message}`);
    return null;
  }
}
