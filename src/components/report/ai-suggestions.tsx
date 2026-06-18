import type { AISuggestion } from "@/lib/utils/types";

interface AiSuggestionsProps {
  suggestions: AISuggestion[];
}

export function AiSuggestions({ suggestions }: AiSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="glass-card p-5 sm:p-6 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="section-header">
        <div className="section-header-icon">💡</div>
        <h3>Improvement Suggestions</h3>
      </div>

      <div className="space-y-3 stagger-children">
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-lg transition-colors"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <span className={`badge badge-severity-${suggestion.severity} shrink-0 self-start mt-0.5`}>
              {suggestion.severity}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                {suggestion.category}
              </span>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>
                {suggestion.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
