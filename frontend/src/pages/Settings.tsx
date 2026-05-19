import { Check, Key, Music, Wallet } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const apiKeys = [
  { name: "Anthropic (Claude)", status: "connected" },
  { name: "Google Veo3", status: "not_set" },
  { name: "ElevenLabs", status: "connected" },
  { name: "TikTok API", status: "connected" },
];

const weights = [
  { name: "Hook", value: 30 },
  { name: "Visual", value: 20 },
  { name: "Audio sync", value: 15 },
  { name: "Caption", value: 15 },
  { name: "Trend", value: 20 },
];

export function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-2">
        <PageHeader title="Settings" description="API keys, budget, scoring rubric" />

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
                    <Button variant="outline" size="sm" className="h-7 text-xs">
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
                <Label className="text-xs">Daily cap</Label>
                <Input defaultValue="$20" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Monthly cap</Label>
                <Input defaultValue="$500" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alert at</Label>
                <Input defaultValue="80%" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Music className="h-4 w-4" />
              <span className="text-sm font-semibold">Scoring rubric weights</span>
            </div>
            <div className="space-y-5 p-5">
              {weights.map((w) => (
                <div key={w.name} className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm">{w.name}</Label>
                  <Slider defaultValue={[w.value]} max={100} step={5} />
                  <span className="font-mono text-xs tabular-nums text-right">{w.value}%</span>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                  <Label className="text-sm">Auto-approve ≥</Label>
                  <Slider defaultValue={[90]} max={100} step={5} />
                  <span className="font-mono text-xs tabular-nums text-right">90</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
