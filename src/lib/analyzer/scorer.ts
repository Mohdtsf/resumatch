// ============================================================
// ResuMatch — Score Calculator
// Combines all rule-based analysis into weighted final score
// ============================================================

import { SCORE_WEIGHTS } from "@/lib/utils/constants";
import type { ScoreBreakdown, RuleBasedAnalysis } from "@/lib/utils/types";
import { matchKeywords } from "./keyword-matcher";
import { checkFormatting } from "./format-checker";
import { detectSections, calculateStructureScore, calculateCompletenessScore } from "./section-detector";

/**
 * Run the complete rule-based analysis pipeline.
 * This produces a full analysis WITHOUT any AI dependency.
 */
export function runRuleBasedAnalysis(
  resumeText: string,
  jobDescriptionText: string
): RuleBasedAnalysis {
  // 1. Keyword matching
  const keywordResult = matchKeywords(resumeText, jobDescriptionText);

  // 2. Format checking
  const formatResult = checkFormatting(resumeText);

  // 3. Section detection
  const sections = detectSections(resumeText);
  const structureScore = calculateStructureScore(sections);

  // 4. Completeness
  const completenessScore = calculateCompletenessScore(resumeText, sections);

  return {
    keywordScore: keywordResult.score,
    formattingScore: formatResult.score,
    structureScore,
    completenessScore,
    matchedKeywords: keywordResult.matchedKeywords,
    missingKeywords: keywordResult.missingKeywords,
    sectionAnalysis: sections,
    formatIssues: formatResult.issues,
  };
}

/**
 * Calculate the weighted overall ATS score from individual sub-scores.
 */
export function calculateOverallScore(breakdown: ScoreBreakdown): number {
  const weighted =
    breakdown.keywordMatch * SCORE_WEIGHTS.keywordMatch +
    breakdown.formatting * SCORE_WEIGHTS.formatting +
    breakdown.structure * SCORE_WEIGHTS.structure +
    breakdown.completeness * SCORE_WEIGHTS.completeness +
    breakdown.aiEnhancement * SCORE_WEIGHTS.aiEnhancement;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

/**
 * Build a ScoreBreakdown from rule-based analysis + optional AI adjustment.
 */
export function buildScoreBreakdown(
  ruleAnalysis: RuleBasedAnalysis,
  aiScoreAdjustment: number = 0
): ScoreBreakdown {
  // AI enhancement score is the average of other scores + AI adjustment
  const avgRuleScore = Math.round(
    (ruleAnalysis.keywordScore +
      ruleAnalysis.formattingScore +
      ruleAnalysis.structureScore +
      ruleAnalysis.completenessScore) / 4
  );

  const aiEnhancement = Math.min(
    100,
    Math.max(0, avgRuleScore + aiScoreAdjustment)
  );

  return {
    keywordMatch: ruleAnalysis.keywordScore,
    formatting: ruleAnalysis.formattingScore,
    structure: ruleAnalysis.structureScore,
    completeness: ruleAnalysis.completenessScore,
    aiEnhancement,
  };
}
