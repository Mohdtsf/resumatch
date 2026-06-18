export function HeroSection() {
  return (
    <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
      {/* Logo/Brand */}
      <div className="inline-flex items-center gap-2 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
            color: "white",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
          }}
        >
          ✦
        </div>
        <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          ResuMatch
        </span>
      </div>

      <h1
        className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
        style={{ color: "var(--text-primary)" }}
      >
        AI-Powered Resume
        <br />
        <span style={{ color: "var(--primary-500)" }}>ATS Score Checker</span>
      </h1>

      <p
        className="text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Upload your resume and paste the job description — get an instant ATS compatibility score with detailed feedback and AI-powered improvement suggestions.
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {["⚡ Instant Analysis", "🎯 Keyword Matching", "🤖 AI Suggestions", "📊 Detailed Report"].map((feature) => (
          <span
            key={feature}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
