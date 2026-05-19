import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { todaySchedule } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConf = {
  done: { icon: CheckCircle2, color: "text-success" },
  running: { icon: Loader2, color: "text-primary animate-spin" },
  pending: { icon: Clock, color: "text-muted-foreground" },
};

export function ScheduleCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Lịch hôm nay</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">3 slots</span>
      </div>
      <ul className="divide-y divide-border">
        {todaySchedule.map((s) => {
          const cfg = statusConf[s.status];
          return (
            <li key={s.time} className="flex items-center gap-3 px-5 py-3">
              <span className="font-mono text-xs tabular-nums w-12 text-muted-foreground">
                {s.time}
              </span>
              <span className="flex-1 text-sm">{s.action}</span>
              <cfg.icon className={cn("h-4 w-4", cfg.color)} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
