import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";

interface ScoreBreakdownProps {
  atsScore: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    structure: number;
    completeness: number;
    aiEnhancement: number;
  };
}

export function ScoreBreakdown({ atsScore, breakdown }: ScoreBreakdownProps) {
  return (
    <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <ScoreRing score={atsScore} size={160} />
        <div className="flex-1 w-full space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Score Breakdown
          </h2>
          <ProgressBar value={breakdown.keywordMatch} label="Keyword Match" />
          <ProgressBar value={breakdown.formatting} label="ATS Formatting" />
          <ProgressBar value={breakdown.structure} label="Structure" />
          <ProgressBar value={breakdown.completeness} label="Completeness" />
          <ProgressBar value={breakdown.aiEnhancement} label="AI Enhancement" />
        </div>
      </div>
    </div>
  );
}
