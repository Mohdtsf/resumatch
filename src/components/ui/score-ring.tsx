"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  label,
  animated = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreClass = (s: number) => {
    if (s >= 80) return { text: "score-excellent", stroke: "stroke-excellent", bg: "bg-score-excellent" };
    if (s >= 60) return { text: "score-good", stroke: "stroke-good", bg: "bg-score-good" };
    if (s >= 40) return { text: "score-fair", stroke: "stroke-fair", bg: "bg-score-fair" };
    return { text: "score-poor", stroke: "stroke-poor", bg: "bg-score-poor" };
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Work";
  };

  const classes = getScoreClass(score);

  return (
    <div className="score-ring-container">
      <svg
        className="score-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="score-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className={`score-ring-progress ${classes.stroke}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={
            animated
              ? {
                  strokeDashoffset: offset,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }
              : undefined
          }
        />
      </svg>

      {/* Score text */}
      <div
        className="absolute flex flex-col items-center"
        style={{ transform: "rotate(0deg)" }}
      >
        <span className={`text-4xl font-bold ${classes.text}`}>
          {score}
        </span>
        <span
          className="text-xs font-medium mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label || getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
