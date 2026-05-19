import { motion } from "framer-motion";
import { Pause, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { livePipeline, type JobStatus } from "@/lib/mock-data";

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
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-success/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-sm font-semibold">Pipeline đang chạy</span>
          <Badge variant="muted" className="font-mono">
            {livePipeline.length} jobs
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          Xem tất cả
        </Button>
      </div>
      <div className="divide-y divide-border">
        {livePipeline.map((job) => (
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
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-brand"
                  />
                  <div className="absolute inset-y-0 right-0 w-12 -translate-x-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {job.progress}%
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
    </Card>
  );
}
