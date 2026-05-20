import { Link } from "react-router-dom";
import { Video, Inbox, DollarSign, TrendingUp, Pause, Play } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { StatCard } from "@/components/dashboard/stat-card";
import { LivePipeline } from "@/components/dashboard/live-pipeline";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { ScheduleCard } from "@/components/dashboard/schedule-card";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import {
  useConfigQuery,
  useGenerateNow,
  useJobsQuery,
  useLiveJobsQuery,
  usePausePipeline,
  useResumePipeline,
  useSettingsQuery,
} from "@/lib/queries";

const ALL_STATUSES = "published,approved,rejected,review";

export function DashboardPage() {
  const { data: reviewJobs = [] } = useJobsQuery({ status: "review" });
  const { data: library = [] } = useJobsQuery({ status: ALL_STATUSES });
  const { data: livePipeline = [] } = useLiveJobsQuery();
  const { data: config } = useConfigQuery();
  const { data: settings } = useSettingsQuery();

  const generate = useGenerateNow();
  const pauseM = usePausePipeline();
  const resumeM = useResumePipeline();

  const paused = config?.paused ?? false;
  const quota = config?.quota ?? 5;
  const budgetDaily = settings?.budget_daily ?? 20;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const generatedToday = library.filter(
    (j) => new Date(j.createdAt).getTime() >= todayStart.getTime() - 86400000,
  ).length;

  const publishedJobs = library.filter((j) => j.status === "published");
  const publishedToday = publishedJobs.length;
  const publishedViews = publishedJobs.reduce((s, j) => s + (j.views ?? 0), 0);

  const costToday = livePipeline.length * 1.5 + library.length * 0.3;

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
              Hôm nay — <span className="text-gradient-brand">{generatedToday} video</span>
            </span>
          }
          description={
            <span>
              {generatedToday}/{quota} gen ·{" "}
              <Link
                to="/review"
                className="text-foreground hover:text-primary underline-offset-2 hover:underline"
              >
                {reviewJobs.length} chờ duyệt
              </Link>{" "}
              · ${costToday.toFixed(2)} chi phí
            </span>
          }
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (paused) {
                    resumeM.mutate(undefined, {
                      onSuccess: () => toast.success("Pipeline đã resume"),
                    });
                  } else {
                    pauseM.mutate(undefined, { onSuccess: () => toast("Pipeline paused") });
                  }
                }}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {paused ? "Resume" : "Pause"} all
              </Button>
              <ShimmerButton
                className="text-sm"
                onClick={() =>
                  generate.mutate(
                    {},
                    {
                      onSuccess: () =>
                        toast.success("Đã queue 1 video mới", {
                          description: "Pipeline bắt đầu generate idea...",
                        }),
                    },
                  )
                }
              >
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
            value={generatedToday}
            suffix={` / ${quota}`}
            hint="video đã generate"
            highlight
          />
          <StatCard
            icon={Inbox}
            label="Pending"
            value={reviewJobs.length}
            hint="awaiting review"
            trend={reviewJobs.length > 0 ? { value: 12, positive: true } : undefined}
          />
          <StatCard
            icon={DollarSign}
            label="Cost today"
            value={costToday}
            decimals={2}
            prefix="$"
            hint={`/ $${budgetDaily} cap (${Math.round((costToday / budgetDaily) * 100)}%)`}
          />
          <StatCard
            icon={TrendingUp}
            label="Published"
            value={publishedToday}
            hint={`+${formatNumber(publishedViews)} views`}
            trend={publishedToday > 0 ? { value: 24, positive: true } : undefined}
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
  const { data: library = [] } = useJobsQuery({ status: "published", sort: "newest" });
  const recent = library.slice(0, 4);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-sm font-semibold">Vừa publish</span>
        <Link
          to="/library"
          className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
        >
          Xem tất cả →
        </Link>
      </div>
      {recent.length === 0 ? (
        <div className="p-6 text-center text-xs text-muted-foreground">
          Chưa có video nào được publish
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {recent.map((v) => (
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
      )}
    </div>
  );
}
