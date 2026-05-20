import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Music2,
  Mic,
  Pencil,
  Play,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Wand2,
  X,
  AlertTriangle,
  Inbox,
  Loader2,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScoreRing } from "@/components/review/score-ring";
import { ScoreBadge, scoreLevel } from "@/components/review/score-badge";
import { type ScoreBreakdown, type VideoJob } from "@/lib/mock-data";
import { cn, formatDuration } from "@/lib/utils";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { api } from "@/lib/api";
import {
  useApproveJob,
  useDeleteClip,
  useJobQuery,
  useJobsQuery,
  usePatchJob,
  useRegenerateClip,
  useRejectJob,
} from "@/lib/queries";

const criteriaLabels: Record<keyof ScoreBreakdown, string> = {
  hook: "Hook (3s đầu)",
  visual: "Visual quality",
  audio: "Audio sync",
  caption: "Caption & hashtag",
  trend: "Trend relevance",
};

export function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading } = useJobQuery(id);
  const { data: queue = [] } = useJobsQuery({ status: "review" });

  const approveMut = useApproveJob();
  const rejectMut = useRejectJob();
  const patchMut = usePatchJob();
  const regenMut = useRegenerateClip();
  const deleteMut = useDeleteClip();

  const [musicVolume, setMusicVolume] = useState([30]);
  const [voiceSpeed, setVoiceSpeed] = useState([100]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    setCaption(job?.caption ?? "");
    setHashtags(job?.hashtags ?? []);
  }, [job?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-24 text-center">
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Video không tồn tại</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Có thể đã được approve/reject hoặc bạn vào nhầm link.
        </p>
        <Button className="mt-4" onClick={() => navigate("/review")}>
          <ArrowLeft className="h-4 w-4" /> Về Review queue
        </Button>
      </div>
    );
  }

  const currentIdx = queue.findIndex((v) => v.id === job.id);
  const nextJob =
    currentIdx >= 0 && queue.length > 1 ? queue[(currentIdx + 1) % queue.length] : null;

  const handleSuggestHashtags = async () => {
    setSuggesting(true);
    try {
      const { hashtags: tags } = await api.suggestHashtags(hashtags);
      setHashtags([...hashtags, ...tags]);
      toast.success(`AI gợi ý ${tags.length} hashtag mới`);
    } finally {
      setSuggesting(false);
    }
  };

  const handleRegenScene = (clipId: string) => {
    regenMut.mutate(
      { jobId: job.id, clipId },
      {
        onSuccess: () =>
          toast.success("Scene đã được re-generate", {
            description: "Visual nhiễu đã được fix.",
          }),
        onError: () => toast.error("Re-gen failed"),
      },
    );
  };

  const handleRemoveClip = (clipId: string) => {
    deleteMut.mutate(
      { jobId: job.id, clipId },
      { onSuccess: () => toast("Clip đã được xoá") },
    );
  };

  const handleSaveDraft = () => {
    patchMut.mutate(
      { id: job.id, patch: { caption, hashtags } },
      {
        onSuccess: () => toast.success("Draft đã được lưu"),
        onError: () => toast.error("Save failed"),
      },
    );
  };

  const handleApprove = () => {
    patchMut.mutate(
      { id: job.id, patch: { caption, hashtags } },
      {
        onSuccess: () => {
          approveMut.mutate(
            { id: job.id },
            {
              onSuccess: () => {
                toast.success("✅ Đã publish lên TikTok!", {
                  description: `${job.title} — sẽ live trong vài giây`,
                });
                if (nextJob) navigate(`/review/${nextJob.id}`);
                else navigate("/review");
              },
              onError: () => toast.error("Approve failed"),
            },
          );
        },
      },
    );
  };

  const handleReject = () => {
    rejectMut.mutate(job.id, {
      onSuccess: () => {
        toast(`Đã reject ${job.id}`, {
          description: "Video đã được lưu vào library với status rejected",
        });
        if (nextJob) navigate(`/review/${nextJob.id}`);
        else navigate("/review");
      },
    });
  };

  const approving = approveMut.isPending || patchMut.isPending;

  return (
    <>
      <Topbar
        title={job.title}
        description={`Reviewing ${job.id} · AI Score ${job.aiScore}`}
        actions={
          nextJob ? (
            <Link to={`/review/${nextJob.id}`}>
              <Button variant="outline" size="sm">
                Skip
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 h-7 px-2 text-xs text-muted-foreground"
          onClick={() => navigate("/review")}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to queue
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <VideoPreview job={job} />
            <CaptionEditor
              value={caption}
              onChange={setCaption}
              hashtags={hashtags}
              setHashtags={setHashtags}
              onSuggest={handleSuggestHashtags}
              suggesting={suggesting}
            />
            <CustomTools
              clips={job.clips ?? []}
              regenClipId={regenMut.isPending ? regenMut.variables?.clipId ?? null : null}
              onRegen={handleRegenScene}
              onRemove={handleRemoveClip}
              musicVolume={musicVolume}
              setMusicVolume={setMusicVolume}
              voiceSpeed={voiceSpeed}
              setVoiceSpeed={setVoiceSpeed}
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 self-start">
            <AIScorePanel job={job} />
            <PublishPanel />
          </div>
        </div>

        <div className="sticky bottom-0 mt-8 -mx-6 border-t border-border bg-background/95 backdrop-blur-xl px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleReject} disabled={rejectMut.isPending}>
              {rejectMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Re-generate full video — pipeline đã queue")}
            >
              <RefreshCw className="h-4 w-4" />
              Re-generate all
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={patchMut.isPending}
              onClick={handleSaveDraft}
            >
              {patchMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save draft
            </Button>
            <ShimmerButton className="text-sm" onClick={handleApprove} disabled={approving}>
              {approving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Approve & Publish
            </ShimmerButton>
          </div>
        </div>
      </div>
    </>
  );
}

function VideoPreview({ job }: { job: { thumbnail: string; duration: number } }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-lg border border-border bg-black">
          <img src={job.thumbnail} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black shadow-lg">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
          <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
            <span className="font-mono text-[10px] text-white">9:16</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <div className="flex items-center gap-2 text-white">
              <span className="font-mono text-[10px] tabular-nums">00:12</span>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                <div className="absolute inset-y-0 left-0 w-[30%] rounded-full bg-white" />
              </div>
              <span className="font-mono text-[10px] tabular-nums opacity-70">
                {formatDuration(job.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CaptionEditor({
  value,
  onChange,
  hashtags,
  setHashtags,
  onSuggest,
  suggesting,
}: {
  value: string;
  onChange: (v: string) => void;
  hashtags: string[];
  setHashtags: (h: string[]) => void;
  onSuggest: () => void;
  suggesting: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold">Caption</span>
          <span className="font-mono text-[10px] text-muted-foreground">{value.length}/150</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onSuggest}
          disabled={suggesting}
        >
          {suggesting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          Suggest hashtag
        </Button>
      </div>
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          maxLength={150}
          className="w-full resize-none rounded-md border border-input bg-transparent p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/15 hover:text-destructive group"
              onClick={() => setHashtags(hashtags.filter((t) => t !== tag))}
            >
              {tag}
              <X className="ml-0.5 h-2.5 w-2.5 opacity-0 group-hover:opacity-100" />
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function CustomTools({
  clips,
  regenClipId,
  onRegen,
  onRemove,
  musicVolume,
  setMusicVolume,
  voiceSpeed,
  setVoiceSpeed,
}: {
  clips: NonNullable<VideoJob["clips"]>;
  regenClipId: string | null;
  onRegen: (id: string) => void;
  onRemove: (id: string) => void;
  musicVolume: number[];
  setMusicVolume: (v: number[]) => void;
  voiceSpeed: number[];
  setVoiceSpeed: (v: number[]) => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Wand2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold">Custom tools</span>
        </div>
      </div>
      <Tabs defaultValue="timeline" className="p-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          <div className="flex items-stretch gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {clips.map((clip) => {
              const isRegenerating = regenClipId === clip.id;
              return (
                <div
                  key={clip.id}
                  className={cn(
                    "group relative flex h-24 w-20 shrink-0 cursor-pointer flex-col overflow-hidden rounded-md border-2 transition-all",
                    clip.warning
                      ? "border-warning/60 hover:border-warning"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <img src={clip.thumbnail} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-1.5 py-0.5">
                    <span className="font-mono text-[9px] text-white font-semibold">
                      {clip.index}
                    </span>
                    {clip.warning ? <AlertTriangle className="h-2.5 w-2.5 text-warning" /> : null}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-0.5">
                    <span className="font-mono text-[9px] text-white">{clip.duration}s</span>
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70 transition-opacity",
                      isRegenerating ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-[9px] text-white">Re-gen...</span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onRegen(clip.id);
                          }}
                          className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] text-white hover:bg-white/30"
                        >
                          Re-gen
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onRemove(clip.id);
                          }}
                          className="rounded bg-destructive/30 px-1.5 py-0.5 text-[9px] text-white hover:bg-destructive/50"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => toast.info("Add scene chưa được hỗ trợ ở MVP")}
              className="h-24 w-20 shrink-0 rounded-md border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors grid place-items-center"
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              {clips.length} scene · tổng {clips.reduce((s, c) => s + c.duration, 0)}s
            </span>
          </div>
        </TabsContent>
        <TabsContent value="audio" className="mt-4 space-y-4">
          <AudioRow
            icon={<Music2 className="h-4 w-4 text-muted-foreground" />}
            label="Background music"
            value="Trending Beat #4"
            slider={musicVolume}
            setSlider={setMusicVolume}
            unit="%"
            max={100}
          />
          <Separator />
          <AudioRow
            icon={<Mic className="h-4 w-4 text-muted-foreground" />}
            label="Voiceover (Vietnamese male)"
            value="ElevenLabs · ID 4f7"
            slider={voiceSpeed}
            setSlider={setVoiceSpeed}
            unit="%"
            min={50}
            max={200}
          />
        </TabsContent>
        <TabsContent value="overlay" className="mt-4">
          <div className="rounded-md border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">
              Thêm text overlay, sticker, logo lên video
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 h-7 text-xs"
              onClick={() => toast.info("Overlay editor sẽ có ở phase 2")}
            >
              + Add overlay
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function AudioRow({
  icon,
  label,
  value,
  slider,
  setSlider,
  unit,
  min = 0,
  max = 100,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  slider: number[];
  setSlider: (v: number[]) => void;
  unit: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_180px_auto] items-center gap-4">
      <div className="flex items-center gap-2">
        {icon}
        <div className="min-w-0">
          <p className="truncate text-sm">{label}</p>
          <p className="font-mono text-[10px] text-muted-foreground truncate">{value}</p>
        </div>
      </div>
      <Slider value={slider} onValueChange={setSlider} min={min} max={max} step={5} />
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs tabular-nums w-10 text-right">
          {slider[0]}
          {unit}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Play className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function AIScorePanel({ job }: { job: VideoJob }) {
  const breakdown = job.scoreBreakdown;
  if (!breakdown) return null;
  const level = scoreLevel(job.aiScore);
  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "flex items-center justify-between border-b border-border px-4 py-2.5",
          level === "high" && "bg-success/5",
          level === "mid" && "bg-warning/5",
          level === "low" && "bg-destructive/5",
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold">AI Scoring</span>
        </div>
        <ScoreBadge score={job.aiScore} />
      </div>

      <div className="grid place-items-center px-4 py-5">
        <ScoreRing score={job.aiScore} />
      </div>

      <div className="space-y-3 px-4 pb-4">
        {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
          const item = breakdown[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{criteriaLabels[key]}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.weight}%
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {item.score}/10
                  </span>
                </div>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    item.score >= 8
                      ? "bg-success"
                      : item.score >= 5
                        ? "bg-warning"
                        : "bg-destructive",
                  )}
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.feedback}</p>
            </div>
          );
        })}
      </div>

      {job.suggestions && job.suggestions.length > 0 ? (
        <div className="border-t border-border bg-primary/5 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            💡 AI Suggestions
          </p>
          <ul className="space-y-1.5">
            {job.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="flex-1 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}

function PublishPanel() {
  return (
    <Card>
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
        <span className="text-sm font-semibold">Publish to TikTok</span>
      </div>
      <div className="space-y-3 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Schedule</span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Publish now
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Account</span>
          <span className="font-medium">@aiveo3.vn</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Visibility</span>
          <span className="font-medium">Public</span>
        </div>
      </div>
    </Card>
  );
}
