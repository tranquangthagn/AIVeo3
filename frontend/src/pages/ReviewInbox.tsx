import { Link } from "react-router-dom";
import { Filter, ChevronRight, Clock } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/review/score-badge";
import { reviewQueue, type Verdict } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";

const verdictLabel: Record<Verdict, { label: string; cls: string }> = {
  approve_recommended: { label: "Recommend approve", cls: "bg-success/15 text-success" },
  needs_edit: { label: "Cần chỉnh sửa", cls: "bg-warning/15 text-warning" },
  reject_recommended: { label: "Recommend reject", cls: "bg-destructive/15 text-destructive" },
};

export function ReviewInboxPage() {
  return (
    <>
      <Topbar title="Review queue" description={`${reviewQueue.length} video chờ duyệt`} />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader
          title="Review queue"
          description="AI đã chấm điểm — bạn duyệt lần cuối trước khi publish lên TikTok"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort: AI Score
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-3">
          {reviewQueue.map((job) => {
            const v = job.verdict ? verdictLabel[job.verdict] : null;
            return (
              <Link key={job.id} to={`/review/${job.id}`}>
                <Card className="group overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-stretch gap-4 p-4">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md border border-border">
                      <img src={job.thumbnail} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-0.5">
                        <span className="font-mono text-[10px] text-white">{job.duration}s</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {job.id}
                          </span>
                          <Badge variant="muted" className="text-[10px]">
                            {job.topic}
                          </Badge>
                          {v ? (
                            <span
                              className={cn(
                                "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                                v.cls,
                              )}
                            >
                              {v.label}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-1 truncate text-base font-semibold tracking-tight">
                          {job.title}
                        </h3>
                        {job.caption ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {job.caption}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(job.createdAt)}
                        </span>
                        {job.suggestions && job.suggestions.length > 0 ? (
                          <span className="font-mono text-[10px]">
                            {job.suggestions.length} suggestions
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <ScoreBadge score={job.aiScore} />
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
