import { useState } from "react";
import { toast } from "sonner";
import { Check, Key, Music, Wallet, Loader2, Save } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/store/use-app-store";
import { delay } from "@/lib/fake-api";

const apiKeys = [
  { name: "Anthropic (Claude)", status: "connected" },
  { name: "Google Veo3", status: "not_set" },
  { name: "ElevenLabs", status: "connected" },
  { name: "TikTok API", status: "connected" },
];

export function SettingsPage() {
  const weights = useAppStore((s) => s.weights);
  const setWeights = useAppStore((s) => s.setWeights);
  const autoApprove = useAppStore((s) => s.autoApprove);
  const setAutoApprove = useAppStore((s) => s.setAutoApprove);
  const budget = useAppStore((s) => s.budget);
  const setBudget = useAppStore((s) => s.setBudget);
  const [saving, setSaving] = useState(false);

  const total = weights.hook + weights.visual + weights.audio + weights.caption + weights.trend;

  const handleSave = async () => {
    setSaving(true);
    try {
      await delay(null, 500);
      toast.success("Settings đã được lưu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Settings" />
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-2">
        <PageHeader
          title="Settings"
          description="API keys, budget, scoring rubric"
          actions={
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
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
                        toast.info(`${k.name} connect flow — sẽ có khi tích hợp backend`)
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
                  value={budget.daily}
                  onChange={(e) => setBudget({ daily: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Monthly cap ($)</Label>
                <Input
                  type="number"
                  value={budget.monthly}
                  onChange={(e) => setBudget({ monthly: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alert at (%)</Label>
                <Input
                  type="number"
                  value={budget.alertAt}
                  onChange={(e) => setBudget({ alertAt: Number(e.target.value) })}
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
              {(["hook", "visual", "audio", "caption", "trend"] as const).map((key) => (
                <div key={key} className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm capitalize">{key}</Label>
                  <Slider
                    value={[weights[key]]}
                    max={100}
                    step={5}
                    onValueChange={(v) => setWeights({ [key]: v[0] })}
                  />
                  <span className="font-mono text-xs tabular-nums text-right">
                    {weights[key]}%
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm">Auto-approve ≥</Label>
                  <Slider
                    value={[autoApprove]}
                    max={100}
                    step={5}
                    onValueChange={(v) => setAutoApprove(v[0])}
                  />
                  <span className="font-mono text-xs tabular-nums text-right">{autoApprove}</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Video có AI Score ≥ {autoApprove} sẽ được auto-approve, không cần review thủ công.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
