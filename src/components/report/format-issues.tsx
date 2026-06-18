import type { FormatIssue } from "@/lib/utils/types";

interface FormatIssuesProps {
  issues: FormatIssue[];
}

export function FormatIssues({ issues }: FormatIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <div className="glass-card p-5 sm:p-6 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
      <div className="section-header">
        <div className="section-header-icon">⚠️</div>
        <h3>Formatting Issues</h3>
      </div>

      <div className="space-y-2">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: "rgba(245,158,11,0.05)" }}
          >
            <span className={`badge badge-severity-${issue.severity} shrink-0`}>
              {issue.severity}
            </span>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {issue.issue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
