import { useMemo } from "react";
import { Search, Eye, Heart, Inbox } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/review/score-badge";
import { type JobStatus } from "@/lib/mock-data";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import {
  useAppStore,
  sortLibrary,
  type LibraryFilter,
  type LibrarySort,
} from "@/store/use-app-store";

const filters: { key: LibraryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "approved", label: "Approved" },
  { key: "review", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

const sortOptions: { key: LibrarySort; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "score_desc", label: "AI Score ↓" },
  { key: "views_desc", label: "Views ↓" },
];

const statusLabel: Record<string, string> = {
  published: "Published",
  approved: "Approved · scheduled",
  review: "Pending review",
  rejected: "Rejected",
};

export function LibraryPage() {
  const items = useAppStore((s) => s.library);
  const filter = useAppStore((s) => s.libraryFilter);
  const sort = useAppStore((s) => s.librarySort);
  const search = useAppStore((s) => s.librarySearch);
  const setFilter = useAppStore((s) => s.setLibraryFilter);
  const setSort = useAppStore((s) => s.setLibrarySort);
  const setSearch = useAppStore((s) => s.setLibrarySearch);

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== "all") list = list.filter((i) => i.status === (filter as JobStatus));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.topic.toLowerCase().includes(q) ||
          (j.caption ?? "").toLowerCase().includes(q),
      );
    }
    return sortLibrary(list, sort);
  }, [items, filter, sort, search]);

  return (
    <>
      <Topbar title="Library" description={`${items.length} videos total`} />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader
          title="Asset library"
          description={`${filtered.length} hiển thị · ${items.length} tổng`}
          actions={
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search prompt, caption..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 h-8 pl-8 text-sm"
              />
            </div>
          }
        />

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
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
                {filter === f.key && f.key !== "all" ? (
                  <span className="ml-1.5 font-mono text-[10px] opacity-70">
                    {items.filter((i) => i.status === (f.key as JobStatus)).length}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as LibrarySort)}
            className="ml-auto rounded-md border border-border bg-card px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/40 p-12 text-center">
            <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Không có kết quả</p>
            <p className="mt-1 text-xs text-muted-foreground">Đổi filter hoặc xoá search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((v) => (
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
                    <ScoreBadge
                      score={v.aiScore}
                      className="backdrop-blur-md bg-black/40 border-white/20 text-white"
                    />
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
        )}
      </div>
    </>
  );
}
