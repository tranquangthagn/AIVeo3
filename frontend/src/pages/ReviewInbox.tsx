import { Link } from "react-router-dom";
import { ChevronRight, Clock, Search, ArrowUpDown, Inbox, Loader2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScoreBadge } from "@/components/review/score-badge";
import { type Verdict } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";
import { useAppStore, type SortKey, type VerdictFilter } from "@/store/use-app-store";
import { useJobsQuery } from "@/lib/queries";

const verdictLabel: Record<Verdict, { label: string; cls: string }> = {
  approve_recommended: { label: "Recommend approve", cls: "bg-success/15 text-success" },
  needs_edit: { label: "Cần chỉnh sửa", cls: "bg-warning/15 text-warning" },
  reject_recommended: { label: "Recommend reject", cls: "bg-destructive/15 text-destructive" },
};

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "score_desc", label: "AI Score ↓" },
  { key: "score_asc", label: "AI Score ↑" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

const verdictFilters: { key: VerdictFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "approve_recommended", label: "🟢 Approve" },
  { key: "needs_edit", label: "🟡 Edit" },
  { key: "reject_recommended", label: "🔴 Reject" },
];

export function ReviewInboxPage() {
  const sort = useAppStore((s) => s.reviewSort);
  const verdict = useAppStore((s) => s.reviewVerdict);
  const search = useAppStore((s) => s.reviewSearch);
  const setSort = useAppStore((s) => s.setReviewSort);
  const setVerdict = useAppStore((s) => s.setReviewVerdict);
  const setSearch = useAppStore((s) => s.setReviewSearch);

  const { data: jobs = [], isLoading } = useJobsQuery({
    status: "review",
    verdict: verdict === "all" ? undefined : verdict,
    search: search.trim() || undefined,
    sort,
  });

  return (
    <>
      <Topbar title="Review queue" description={`${jobs.length} video chờ duyệt`} />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader
          title="Review queue"
          description="AI đã chấm điểm — bạn duyệt lần cuối trước khi publish lên TikTok"
          actions={
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search title, topic, id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 h-8 pl-8 text-sm"
              />
            </div>
          }
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {verdictFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setVerdict(f.key)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  verdict === f.key
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3 w-3" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-border bg-card px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {jobs.map((job) => {
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
        )}
      </div>
    </>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/40 p-12 text-center">
      <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">
        {search ? "Không có video nào khớp với search" : "Không có video nào trong queue"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {search ? "Đổi filter hoặc tìm từ khoá khác" : "Agent sẽ tự gen video mới theo lịch"}
      </p>
    </div>
  );
}
