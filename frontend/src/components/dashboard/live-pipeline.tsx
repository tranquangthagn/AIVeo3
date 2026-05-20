import { motion } from "framer-motion";
import { Pause, X, Sparkles, Play, Inbox, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type JobStatus } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  useConfigQuery,
  useLiveJobsQuery,
  usePausePipeline,
  useResumePipeline,
} from "@/lib/queries";

const stageLabels: Record<JobStatus, string> = {
  queued: "Queued",
  generating_idea: "Generating idea",
  writing_script: "Writing script",
  generating_video: "Generating clip",
  assembling: "Assembling",
  scoring: "AI scoring",
  review: "Awaiting review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
  failed: "Failed",
};

export function LivePipeline() {
  const { data: jobs = [], isLoading } = useLiveJobsQuery();
  const { data: config } = useConfigQuery();
  const paused = config?.paused ?? false;
  const pauseM = usePausePipeline();
  const resumeM = useResumePipeline();

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {!paused ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-success/50" />
            ) : null}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${paused ? "bg-warning" : "bg-success"}`}
            />
          </span>
          <span className="text-sm font-semibold">
            {paused ? "Pipeline paused" : "Pipeline đang chạy"}
          </span>
          <Badge variant="muted" className="font-mono">
            {jobs.length} jobs
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            if (paused) {
              resumeM.mutate(undefined, { onSuccess: () => toast.success("Pipeline đã resume") });
            } else {
              pauseM.mutate(undefined, { onSuccess: () => toast("Pipeline paused") });
            }
          }}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? "Resume" : "Pause"}
        </Button>
      </div>
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-8 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm">Không có job đang chạy</p>
          <p className="text-xs text-muted-foreground">Nhấn "Gen ngay" để bắt đầu</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md border border-border">
                <img src={job.thumbnail} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Sparkles className="h-3 w-3 text-white animate-pulse-soft" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{job.id}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {stageLabels[job.status]}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm font-medium">{job.title}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      animate={{ width: `${job.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-brand"
                    />
                    {!paused ? (
                      <div className="absolute inset-y-0 right-0 w-12 -translate-x-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    ) : null}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {Math.round(job.progress)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
