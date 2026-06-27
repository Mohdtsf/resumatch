"use client";

import { useTheme } from "@/components/theme-provider";
import Link from "next/link";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-6 z-50 flex justify-center w-full px-4 pointer-events-none">
      <nav
        className="w-full max-w-2xl rounded-full border shadow-lg transition-all duration-300 pointer-events-auto flex items-center justify-between px-6 py-3"
        style={{
          borderColor: "var(--border-glass)",
          background: "var(--bg-glass)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Left Side: Logo and Name */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:rotate-12"
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
                color: "white",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
              }}
            >
              ✦
            </div>
            <span
              className="font-bold text-xl tracking-tight transition-colors duration-300 group-hover:opacity-80"
              style={{ color: "var(--text-primary)" }}
            >
              ResuMatch
            </span>
          </Link>
        </div>

        {/* Right Side: Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
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
        </div>
      </nav>
    </div>
  );
}
