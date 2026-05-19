import { useState } from "react";
import { Save, Play } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function PipelineConfigPage() {
  const [days, setDays] = useState({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false });

  return (
    <>
      <Topbar title="Pipeline Config" />
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-2">
        <PageHeader
          title="Pipeline configuration"
          description="Cấu hình cách AI agent tạo content"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4" />
                Save & Run now
              </Button>
            </>
          }
        />

        <div className="space-y-4">
          <Section title="🎯 Niche & Style">
            <Field label="Niche" hint="Topic chính agent sẽ tập trung">
              <Input defaultValue="Công nghệ AI, productivity tools" />
            </Field>
            <Field label="Target audience">
              <Input defaultValue="GenZ Việt Nam 18-30, tech enthusiast" />
            </Field>
            <Field label="Tone">
              <div className="flex gap-2">
                {["Formal", "Casual", "Funny", "Edu"].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded-md border px-3 py-1.5 text-xs ${
                      i === 1
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
                <Badge variant="outline" className="cursor-pointer">
                  + add
                </Badge>
              </div>
            </Field>
          </Section>

          <Section title="⏰ Schedule">
            <Field label="Mode">
              <div className="flex items-center gap-2 text-sm">
                <Switch defaultChecked />
                <span>Auto cron schedule</span>
              </div>
            </Field>
            <Field label="Slots">
              <div className="flex gap-2">
                <Input defaultValue="08:00" className="w-24" />
                <Input defaultValue="14:00" className="w-24" />
                <Button variant="outline" size="sm" className="h-9">
                  + add
                </Button>
              </div>
            </Field>
            <Field label="Days">
              <div className="flex gap-1.5">
                {Object.entries(days).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setDays({ ...days, [k]: !v })}
                    className={`h-9 w-9 rounded-md border text-xs font-medium uppercase ${
                      v ? "bg-primary/10 border-primary/50 text-primary" : "border-border"
                    }`}
                  >
                    {k[0]}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Quota">
              <div className="flex items-center gap-2 text-sm">
                Max <Input defaultValue="5" className="w-16" /> video / ngày
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
