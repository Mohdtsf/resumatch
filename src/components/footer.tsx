"use client";

import { DEVELOPER_NAME, DEVELOPER_EMAIL } from "@/lib/utils/constants";
import { useTheme } from "@/components/theme-provider";

export function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer
      className="w-full border-t"
      style={{
        borderColor: "var(--border-light)",
        background: "var(--bg-glass-strong)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Developer Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {DEVELOPER_NAME}
            </span>
            <span className="hidden sm:inline">•</span>
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="hover:underline transition-colors"
              style={{ color: "var(--primary-500)" }}
            >
              {DEVELOPER_EMAIL}
            </a>
          </div>

          {/* Built for Digital Heroes */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
              aria-label="Toggle theme"
              id="theme-toggle-btn"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm !py-2 !px-4"
              id="built-for-dh-btn"
            >
              <span>Built for Digital Heroes</span>
            </a>
          </div>
        </div>

        {/* Privacy Notice */}
        <p
          className="text-xs text-center mt-4 opacity-60"
          style={{ color: "var(--text-tertiary)" }}
        >
          🔒 Your resume is analyzed to generate this report and isn&apos;t stored — only the scores and suggestions are saved.
        </p>
      </div>
    </footer>
  );
}
