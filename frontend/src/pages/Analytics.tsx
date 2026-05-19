import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Video, DollarSign, Eye, Star } from "lucide-react";

const generationData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  generated: Math.floor(Math.random() * 8) + 3,
  approved: Math.floor(Math.random() * 6) + 2,
}));

const scoreData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  hook: 6 + Math.random() * 3,
  visual: 6 + Math.random() * 3,
  audio: 6 + Math.random() * 3,
  caption: 6 + Math.random() * 3,
  trend: 5 + Math.random() * 4,
}));

const topVideos = [
  { title: "Veo3 vs Sora — ai mạnh hơn?", views: 5420, score: 92 },
  { title: "5 mẹo dùng AI tăng productivity", views: 1240, score: 87 },
  { title: "AI Agent là gì? 60s giải thích", views: 980, score: 78 },
  { title: "Prompt engineering 2026", views: 740, score: 81 },
];

export function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" description="Performance & cost report" />
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-2">
        <PageHeader title="Analytics" description="Last 30 days" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Video}
            label="Generated"
            value={87}
            hint="62 approved (71%)"
            trend={{ value: 18, positive: true }}
          />
          <StatCard
            icon={DollarSign}
            label="Total cost"
            value={342}
            prefix="$"
            hint="$3.95 / video"
            trend={{ value: 8, positive: false }}
          />
          <StatCard
            icon={Eye}
            label="Views"
            value={124000}
            hint="2.4% engagement"
            trend={{ value: 32, positive: true }}
          />
          <StatCard
            icon={Star}
            label="Avg AI Score"
            value={79}
            hint="↑ 12 vs prev period"
            trend={{ value: 12, positive: true }}
            highlight
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <span className="text-sm font-semibold">Generation vs Approved</span>
            </div>
            <div className="p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generationData}>
                  <defs>
                    <linearGradient id="grad-gen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(270 91% 65%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(270 91% 65%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-app" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="generated"
                    stroke="hsl(270 91% 65%)"
                    fill="url(#grad-gen)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stroke="hsl(142 71% 45%)"
                    fill="url(#grad-app)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <span className="text-sm font-semibold">Top performing</span>
            </div>
            <ul className="divide-y divide-border">
              {topVideos.map((v, i) => (
                <li key={v.title} className="flex items-center gap-3 px-4 py-3">
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-4">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{v.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {v.views.toLocaleString()} views · AI {v.score}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <span className="text-sm font-semibold">AI Score breakdown trend</span>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="hook" stackId="a" fill="hsl(270 91% 65%)" />
                <Bar dataKey="visual" stackId="a" fill="hsl(290 91% 60%)" />
                <Bar dataKey="audio" stackId="a" fill="hsl(310 91% 55%)" />
                <Bar dataKey="caption" stackId="a" fill="hsl(330 91% 60%)" />
                <Bar dataKey="trend" stackId="a" fill="hsl(350 91% 65%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
