"use client";

interface ProgressBarProps {
  value: number;
  label: string;
  maxValue?: number;
}

export function ProgressBar({ value, label, maxValue = 100 }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  const getColor = (v: number) => {
    if (v >= 80) return "#10b981";
    if (v >= 60) return "#3b82f6";
    if (v >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: getColor(value) }}
        >
          {value}%
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${getColor(value)}cc, ${getColor(value)})`,
          }}
        />
      </div>
    </div>
  );
}
