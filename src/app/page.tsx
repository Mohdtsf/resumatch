"use client";

import { useState } from "react";
import { ReportDashboard } from "@/components/report-dashboard";
import { HeroSection } from "@/components/home/hero-section";
import { AnalysisForm } from "@/components/home/analysis-form";
import { HowItWorks } from "@/components/home/how-it-works";
import type { AnalysisReport } from "@/lib/utils/types";

export default function HomePage() {
  const [inlineReport, setInlineReport] = useState<AnalysisReport | null>(null);

  if (inlineReport) {
    return <ReportDashboard report={inlineReport} />;
  }

  return (
    <div className="relative">
      {/* Decorative Orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: "var(--primary-600)", top: "-10%", right: "-5%" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "var(--accent-500)", bottom: "-5%", left: "-10%", animationDelay: "-5s" }} />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        <HeroSection />
        <AnalysisForm onInlineReport={setInlineReport} />
        <HowItWorks />
      </div>
    </div>
  );
}
