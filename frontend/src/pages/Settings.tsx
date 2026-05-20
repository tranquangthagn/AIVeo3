import { toast } from "sonner";
import { Check, Key, Music, Wallet, Loader2, Save } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { usePatchSettings, useSettingsQuery } from "@/lib/queries";

const apiKeys = [
  { name: "Anthropic (Claude)", status: "connected" },
  { name: "Google Veo3", status: "not_set" },
  { name: "ElevenLabs", status: "connected" },
  { name: "TikTok API", status: "connected" },
];

const CRITERIA = ["hook", "visual", "audio", "caption", "trend"] as const;

export function SettingsPage() {
  const { data: settings, isLoading } = useSettingsQuery();
  const patchMut = usePatchSettings();

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const weights = settings.weights;
  const total = CRITERIA.reduce((s, k) => s + (weights[k] ?? 0), 0);

  const updateWeight = (key: string, value: number) =>
    patchMut.mutate({ weights: { ...weights, [key]: value } });

  return (
    <>
      <Topbar title="Settings" />
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-2">
        <PageHeader
          title="Settings"
          description="API keys, budget, scoring rubric"
          actions={
            <Button
              size="sm"
              onClick={() => toast.success("Settings auto-saved khi bạn đổi giá trị")}
            >
              <Save className="h-4 w-4" />
              Auto-save enabled
            </Button>
          }
        />

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Key className="h-4 w-4" />
              <span className="text-sm font-semibold">API Keys</span>
            </div>
            <ul className="divide-y divide-border">
              {apiKeys.map((k) => (
                <li key={k.name} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{k.name}</p>
                    {k.status === "connected" ? (
                      <p className="font-mono text-[10px] text-muted-foreground">
                        ********•••••••
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground">Not set</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {k.status === "connected" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <Check className="h-3.5 w-3.5" /> Connected
                      </span>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        toast.info(`${k.name} connect flow — sẽ có khi tích hợp thật`)
                      }
                    >
                      {k.status === "connected" ? "Update" : "Connect"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold">Budget</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
              <div className="space-y-1.5">
                <Label className="text-xs">Daily cap ($)</Label>
                <Input
                  type="number"
                  value={settings.budget_daily}
                  onChange={(e) => patchMut.mutate({ budget_daily: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Monthly cap ($)</Label>
                <Input
                  type="number"
                  value={settings.budget_monthly}
                  onChange={(e) => patchMut.mutate({ budget_monthly: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alert at (%)</Label>
                <Input
                  type="number"
                  value={settings.budget_alert_at}
                  onChange={(e) => patchMut.mutate({ budget_alert_at: Number(e.target.value) })}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="text-sm font-semibold">Scoring rubric weights</span>
              </div>
              <span
                className={`font-mono text-xs tabular-nums ${
                  total === 100 ? "text-success" : "text-warning"
                }`}
              >
                Tổng: {total}%
              </span>
            </div>
            <div className="space-y-5 p-5">
              {CRITERIA.map((key) => (
                <div key={key} className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm capitalize">{key}</Label>
                  <Slider
                    value={[weights[key] ?? 0]}
                    max={100}
                    step={5}
                    onValueChange={(v) => updateWeight(key, v[0])}
                  />
                  <span className="font-mono text-xs tabular-nums text-right">
                    {weights[key] ?? 0}%
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm">Auto-approve ≥</Label>
                  <Slider
                    value={[settings.auto_approve_threshold]}
                    max={100}
                    step={5}
                    onValueChange={(v) => patchMut.mutate({ auto_approve_threshold: v[0] })}
                  />
                  <span className="font-mono text-xs tabular-nums text-right">
                    {settings.auto_approve_threshold}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Video có AI Score ≥ {settings.auto_approve_threshold} sẽ được auto-approve, không
                  cần review thủ công.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
