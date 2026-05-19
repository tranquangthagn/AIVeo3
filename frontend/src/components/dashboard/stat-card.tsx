import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  trend?: { value: number; positive?: boolean };
  highlight?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  hint,
  trend,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm",
        highlight && "border-primary/30",
      )}
    >
      {highlight ? <BorderBeam size={120} duration={10} /> : null}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "grid h-7 w-7 place-items-center rounded-md",
            highlight ? "bg-gradient-brand text-white" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">
          <NumberTicker value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </div>
        {trend ? (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive",
            )}
          >
            {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
