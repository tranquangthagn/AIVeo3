import { Flame, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trendingTopics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TrendingTopics() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-warning" />
          <span className="text-sm font-semibold">Trending hôm nay</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">refresh 1h ago</span>
      </div>
      <ul className="divide-y divide-border">
        {trendingTopics.map((t, i) => (
          <li
            key={t.topic}
            className="group flex items-center gap-3 px-5 py-2.5 hover:bg-accent/40"
          >
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-4">
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <span className="flex-1 truncate text-sm">{t.topic}</span>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    t.heat >= 90 ? "bg-warning" : "bg-primary",
                  )}
                  style={{ width: `${t.heat}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-6 text-right">
                {t.heat}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
