"use client";

import { useState } from "react";
import Link from "next/link";

interface ReportHeaderProps {
  targetRole?: string | null;
  createdAt: string | Date;
  fileType: string;
}

export function ReportHeader({ targetRole, createdAt, fileType }: ReportHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const createdDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="animate-fade-in-up mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <Link href="/" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--primary-500)" }}>
            ← Back to ResuMatch
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            ATS Analysis Report
          </h1>
          {targetRole && (
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Target Role: <span className="font-medium">{targetRole}</span>
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {createdDate} • {fileType.toUpperCase()} resume
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="btn-secondary"
          id="copy-link-btn"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Share Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
