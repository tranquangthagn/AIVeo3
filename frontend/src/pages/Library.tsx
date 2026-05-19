import { useState } from "react";
import { Search, Eye, Heart } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/review/score-badge";
import { libraryItems, type JobStatus } from "@/lib/mock-data";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

const filters: { key: "all" | JobStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "approved", label: "Approved" },
  { key: "review", label: "Pending" },
];

const statusLabel: Record<string, string> = {
  published: "Published",
  approved: "Approved · scheduled",
  review: "Pending review",
  rejected: "Rejected",
};

export function LibraryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const items = filter === "all" ? libraryItems : libraryItems.filter((i) => i.status === filter);

  return (
    <>
      <Topbar title="Library" description={`${libraryItems.length} videos total`} />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader
          title="Asset library"
          description="Tất cả video đã được tạo, organize theo status"
          actions={
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search prompt..." className="w-64 h-8 pl-8 text-sm" />
            </div>
          }
        />

        <div className="mb-5 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((v) => (
            <div
              key={v.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <ScoreBadge score={v.aiScore} className="backdrop-blur-md bg-black/40 border-white/20 text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="muted" className="bg-white/10 text-white border-white/10">
                    {statusLabel[v.status] ?? v.status}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium leading-snug">{v.title}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{timeAgo(v.createdAt)}</span>
                  {v.views != null ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-0.5">
                        <Eye className="h-2.5 w-2.5" />
                        {formatNumber(v.views)}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Heart className="h-2.5 w-2.5" />
                        {formatNumber(v.likes ?? 0)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
