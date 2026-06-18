"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ReportDashboard } from "@/components/report-dashboard";
import type { AnalysisReport } from "@/lib/utils/types";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { id } = use(params);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/report/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error?.message || "Report not found.");
          setLoading(false);
          return;
        }

        setReport(data.report);
        setLoading(false);
      } catch {
        setError("Failed to load report. Please check the link and try again.");
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-fade-in-up">
          {/* Skeleton loading */}
          <div className="skeleton h-8 w-64 mb-4" />
          <div className="skeleton h-4 w-48 mb-8" />

          <div className="glass-card p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="skeleton w-40 h-40 rounded-full" />
              <div className="flex-1 w-full space-y-4">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="skeleton h-5 w-40 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="skeleton h-5 w-40 mb-4" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full mb-2 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="glass-card p-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            😕
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Report Not Found
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <Link href="/" className="btn-primary">
            <span>Analyze a Resume</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return <ReportDashboard report={report} />;
}
