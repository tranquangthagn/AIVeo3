import { cn } from "@/lib/utils";

export type ScoreLevel = "high" | "mid" | "low";

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}

export function scoreEmoji(score: number) {
  const l = scoreLevel(score);
  return l === "high" ? "🟢" : l === "mid" ? "🟡" : "🔴";
}

export function scoreColorClass(score: number) {
  const l = scoreLevel(score);
  return l === "high"
    ? "text-success border-success/30 bg-success/10"
    : l === "mid"
      ? "text-warning border-warning/30 bg-warning/10"
      : "text-destructive border-destructive/30 bg-destructive/10";
}

interface ScoreBadgeProps {
  score: number;
  className?: string;
  showEmoji?: boolean;
}

export function ScoreBadge({ score, className, showEmoji = true }: ScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums",
        scoreColorClass(score),
        className,
      )}
    >
      {showEmoji ? <span className="text-[8px]">{scoreEmoji(score)}</span> : null}
      {score}
    </span>
  );
}
