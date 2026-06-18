interface KeywordAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordAnalysis({ matchedKeywords, missingKeywords }: KeywordAnalysisProps) {
  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="section-header">
        <div className="section-header-icon">🎯</div>
        <h3>Keyword Analysis</h3>
      </div>

      {matchedKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--accent-600)" }}>
            ✓ Matched ({matchedKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="badge badge-matched">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--danger-500)" }}>
            ✗ Missing ({missingKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw) => (
              <span key={kw} className="badge badge-missing">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {matchedKeywords.length === 0 && missingKeywords.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          No specific keywords detected from the job description.
        </p>
      )}
    </div>
  );
}
