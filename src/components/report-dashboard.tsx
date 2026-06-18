"use client";

import Link from "next/link";
import type { AnalysisReport } from "@/lib/utils/types";
import { ReportHeader } from "@/components/report/report-header";
import { ScoreBreakdown } from "@/components/report/score-breakdown";
import { KeywordAnalysis } from "@/components/report/keyword-analysis";
import { SectionAnalysis } from "@/components/report/section-analysis";
import { AiSuggestions } from "@/components/report/ai-suggestions";
import { FormatIssues } from "@/components/report/format-issues";

interface ReportDashboardProps {
  report: AnalysisReport;
}

export function ReportDashboard({ report }: ReportDashboardProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <ReportHeader
        targetRole={report.targetRole}
        createdAt={report.createdAt}
        fileType={report.fileType}
      />

      <ScoreBreakdown
        atsScore={report.atsScore}
        breakdown={report.scoreBreakdown}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordAnalysis
          matchedKeywords={report.matchedKeywords}
          missingKeywords={report.missingKeywords}
        />
        
        <SectionAnalysis
          sectionAnalysis={report.sectionAnalysis}
        />

        <AiSuggestions
          suggestions={report.aiSuggestions}
        />

        <FormatIssues
          issues={report.formatIssues}
        />
      </div>

      <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/" className="btn-primary">
          <span>Analyze Another Resume</span>
        </Link>
      </div>
    </div>
  );
}
