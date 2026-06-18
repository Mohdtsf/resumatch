export function HowItWorks() {
  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-lg font-semibold text-center mb-6" style={{ color: "var(--text-primary)" }}>
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: "📄",
            title: "Upload & Paste",
            desc: "Upload your resume (PDF/DOCX) and paste the job description you're targeting.",
          },
          {
            icon: "🔍",
            title: "AI Analysis",
            desc: "Our engine runs 50+ ATS compatibility checks and uses AI for qualitative feedback.",
          },
          {
            icon: "📊",
            title: "Get Your Score",
            desc: "Receive a detailed report with your ATS score, keyword gaps, and improvement suggestions.",
          },
        ].map((step) => (
          <div
            key={step.title}
            className="glass-card glass-card-interactive p-5 text-center"
          >
            <div className="text-2xl mb-2">{step.icon}</div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {step.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
