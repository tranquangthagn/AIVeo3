import { Video, Inbox, DollarSign, TrendingUp, Pause, Play } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { StatCard } from "@/components/dashboard/stat-card";
import { LivePipeline } from "@/components/dashboard/live-pipeline";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { ScheduleCard } from "@/components/dashboard/schedule-card";
import { stats, recentPublished } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function DashboardPage() {
  return (
    <>
      <Topbar
        title="Dashboard"
        description={`Chào Thắng — ${new Date().toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}`}
      />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader
          title={
            <span>
              Hôm nay — <span className="text-gradient-brand">{stats.generatedToday} video</span>
            </span>
          }
          description={`Đã gen ${stats.generatedToday}/${stats.quotaToday} video · ${stats.pendingReview} chờ duyệt · $${stats.costToday.toFixed(2)} chi phí`}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4" />
                Pause all
              </Button>
              <ShimmerButton className="text-sm">
                <Play className="h-3.5 w-3.5" />
                Gen ngay
              </ShimmerButton>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Video}
            label="Hôm nay"
            value={stats.generatedToday}
            suffix={` / ${stats.quotaToday}`}
            hint="video đã generate"
            highlight
          />
          <StatCard
            icon={Inbox}
            label="Pending"
            value={stats.pendingReview}
            hint="awaiting review"
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            icon={DollarSign}
            label="Cost today"
            value={stats.costToday}
            decimals={2}
            prefix="$"
            hint={`/ $${stats.costCap} cap (${Math.round((stats.costToday / stats.costCap) * 100)}%)`}
          />
          <StatCard
            icon={TrendingUp}
            label="Published"
            value={stats.publishedToday}
            hint={`+${formatNumber(stats.publishedViews)} views`}
            trend={{ value: 24, positive: true }}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LivePipeline />
          </div>
          <ScheduleCard />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentlyPublished />
          </div>
          <TrendingTopics />
        </div>
      </div>
    </>
  );
}

function RecentlyPublished() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-sm font-semibold">Vừa publish</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {recentPublished.length} videos
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {recentPublished.map((v) => (
          <div
            key={v.id}
            className="group flex gap-3 rounded-md border border-border bg-background/40 p-2 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded">
              <img src={v.thumbnail} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-0.5">
                <span className="font-mono text-[9px] text-white">{v.duration}s</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium line-clamp-2 leading-tight">{v.title}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                <span>👁 {formatNumber(v.views ?? 0)}</span>
                <span>♥ {formatNumber(v.likes ?? 0)}</span>
                <span className="ml-auto">AI {v.aiScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
