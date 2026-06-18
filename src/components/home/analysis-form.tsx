"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { MAX_JD_LENGTH } from "@/lib/utils/constants";
import type { AnalysisReport } from "@/lib/utils/types";

interface AnalysisFormProps {
  onInlineReport: (report: AnalysisReport) => void;
}

export function AnalysisForm({ onInlineReport }: AnalysisFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = jobDescription.length;
  const isValid = file && jobDescription.trim().length >= 10;

  const handleAnalyze = useCallback(async () => {
    if (!file || !isValid) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        // Fallback for non-JSON responses (like 413 Payload Too Large from reverse proxy)
        if (response.status === 413) {
          throw new Error("File is too large. Maximum allowed size is 3MB.");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        } else if (!response.ok) {
          throw new Error(`Server error (${response.status}). Please try again later.`);
        } else {
          throw new Error("Received an unexpected response from the server.");
        }
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Analysis failed. Please try again.");
      }

      // If report was saved to DB, redirect to the report page
      if (data.redirectUrl && !data.inlineReport) {
        router.push(data.redirectUrl);
        return;
      }

      // If DB is not configured, show inline report
      if (data.inlineReport) {
        onInlineReport(data.inlineReport);
        setIsAnalyzing(false);
        return;
      }

      // Fallback redirect
      router.push(data.redirectUrl || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server. Please check your connection and try again.");
      setIsAnalyzing(false);
    }
  }, [file, jobDescription, isValid, router, onInlineReport]);

  return (
    <div className="glass-card p-5 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <div className="space-y-6">
        {/* Step 1: Upload Resume */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
                color: "white",
              }}
            >
              1
            </span>
            Upload Your Resume
          </label>
          <FileUpload
            onFileSelected={setFile}
            selectedFile={file}
            onClear={() => setFile(null)}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "var(--border-light)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>then</span>
          <div className="flex-1 h-px" style={{ background: "var(--border-light)" }} />
        </div>

        {/* Step 2: Job Description */}
        <div>
          <label
            htmlFor="job-description"
            className="flex items-center gap-2 text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
                color: "white",
              }}
            >
              2
            </span>
            Paste the Job Description
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD_LENGTH))}
              placeholder="Paste the full job description here — include requirements, qualifications, and responsibilities for the best analysis..."
              rows={6}
              className="w-full resize-y rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                minHeight: "120px",
                maxHeight: "300px",
              }}
            />
            <span
              className="absolute bottom-2 right-3 text-xs"
              style={{ color: charCount > MAX_JD_LENGTH * 0.9 ? "var(--danger-500)" : "var(--text-tertiary)" }}
            >
              {charCount.toLocaleString()}/{MAX_JD_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg text-sm"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--danger-500)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!isValid || isAnalyzing}
          className="btn-primary w-full text-base !py-3.5"
          id="analyze-btn"
        >
          {isAnalyzing ? (
            <>
              <div className="spinner" />
              <span>Analyzing your resume...</span>
            </>
          ) : (
            <span>Analyze Resume</span>
          )}
        </button>

        {!isValid && (file || jobDescription.length > 0) && (
          <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
            {!file && "Upload a resume file"}
            {file && jobDescription.trim().length < 10 && "Add at least 10 characters of job description"}
          </p>
        )}
      </div>
    </div>
  );
}
