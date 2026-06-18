import type { SectionAnalysis as SectionAnalysisType } from "@/lib/utils/types";

interface SectionAnalysisProps {
  sectionAnalysis: SectionAnalysisType;
}

export function SectionAnalysis({ sectionAnalysis }: SectionAnalysisProps) {
  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
      <div className="section-header">
        <div className="section-header-icon">📋</div>
        <h3>Resume Sections</h3>
      </div>

      <div className="space-y-2.5">
        {Object.entries(sectionAnalysis).map(([section, found]) => (
          <div
            key={section}
            className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
            style={{ background: found ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)" }}
          >
            <span className="text-sm capitalize" style={{ color: "var(--text-primary)" }}>
              {section === "certifications" ? "Certifications / Awards" : section}
            </span>
            {found ? (
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent-500)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Found
              </span>
            ) : (
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--danger-400)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Missing
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
