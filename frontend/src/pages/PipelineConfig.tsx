import { toast } from "sonner";
import { Play, Loader2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  useConfigQuery,
  useGenerateNow,
  usePatchConfig,
} from "@/lib/queries";

const tones = ["Formal", "Casual", "Funny", "Edu"] as const;
const dayLabels: Record<string, string> = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};

export function PipelineConfigPage() {
  const { data: config, isLoading } = useConfigQuery();
  const patchMut = usePatchConfig();
  const generate = useGenerateNow();

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const update = (partial: Record<string, unknown>) => patchMut.mutate(partial);

  const handleSaveAndRun = () => {
    generate.mutate(
      {},
      {
        onSuccess: () => toast.success("Pipeline đã trigger 1 video mới"),
      },
    );
  };

  return (
    <>
      <Topbar title="Pipeline Config" />
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-2">
        <PageHeader
          title="Pipeline configuration"
          description="Cấu hình cách AI agent tạo content — auto-save khi đổi giá trị"
          actions={
            <Button size="sm" onClick={handleSaveAndRun}>
              <Play className="h-4 w-4" />
              Run now
            </Button>
          }
        />

        <div className="space-y-4">
          <Section title="🎯 Niche & Style">
            <Field label="Niche" hint="Topic chính agent sẽ tập trung">
              <Input
                value={config.niche}
                onChange={(e) => update({ niche: e.target.value })}
              />
            </Field>
            <Field label="Target audience">
              <Input
                value={config.audience}
                onChange={(e) => update({ audience: e.target.value })}
              />
            </Field>
            <Field label="Tone">
              <div className="flex gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ tone: t })}
                    className={`rounded-md border px-3 py-1.5 text-xs ${
                      config.tone === t
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Reference channels">
              <div className="flex flex-wrap gap-1.5">
                {["@hieubeo", "@techlead.vn"].map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toast.info("Chức năng add channel sẽ có ở phase sau")}
                >
                  + add
                </Badge>
              </div>
            </Field>
          </Section>

          <Section title="⏰ Schedule">
            <Field label="Mode">
              <div className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!config.paused}
                  onCheckedChange={(v) => update({ paused: !v })}
                />
                <span>{config.paused ? "Pipeline đang paused" : "Auto cron đang chạy"}</span>
              </div>
            </Field>
            <Field label="Slots">
              <div className="flex flex-wrap gap-2">
                {config.slots.map((slot, i) => (
                  <Input
                    key={i}
                    value={slot}
                    onChange={(e) => {
                      const next = [...config.slots];
                      next[i] = e.target.value;
                      update({ slots: next });
                    }}
                    className="w-24"
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => update({ slots: [...config.slots, "12:00"] })}
                >
                  + add
                </Button>
              </div>
            </Field>
            <Field label="Days">
              <div className="flex gap-1.5">
                {(Object.keys(config.days) as Array<keyof typeof config.days>).map((k) => (
                  <button
                    key={k}
                    onClick={() => update({ days: { ...config.days, [k]: !config.days[k] } })}
                    className={`h-9 w-9 rounded-md border text-xs font-medium uppercase ${
                      config.days[k]
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "border-border"
                    }`}
                  >
                    {dayLabels[k]}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Quota">
              <div className="flex items-center gap-2 text-sm">
                Max{" "}
                <Input
                  type="number"
                  value={config.quota}
                  onChange={(e) => update({ quota: Number(e.target.value) })}
                  className="w-16"
                />{" "}
                video / ngày
              </div>
            </Field>
          </Section>

          <Section title="🤖 AI Models">
            <Field label="Idea / Script">
              <Input defaultValue="Claude Opus 4.7" disabled />
            </Field>
            <Field label="Video gen">
              <Input defaultValue="Veo3 Quality" disabled />
            </Field>
            <Field label="Scoring">
              <Input defaultValue="Claude Sonnet 4.6 + vision" disabled />
            </Field>
            <Field label="Voiceover">
              <Input defaultValue="ElevenLabs · Vietnamese male" disabled />
            </Field>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="border-b border-border px-5 py-3 text-sm font-semibold">{title}</div>
      <div className="space-y-4 p-5">{children}</div>
    </Card>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-start gap-4">
      <div>
        <Label className="text-sm">{label}</Label>
        {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
