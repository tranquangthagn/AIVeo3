import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Workflow,
  CheckSquare,
  Library,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useConfigQuery, useJobsQuery } from "@/lib/queries";
import { channels } from "@/lib/mock-data";

export function Sidebar() {
  const { data: reviewJobs } = useJobsQuery({ status: "review" });
  const { data: config } = useConfigQuery();
  const pendingCount = reviewJobs?.length ?? 0;
  const paused = config?.paused ?? false;
  const channel = channels[0];

  const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/pipeline", label: "Pipeline", icon: Workflow },
    { to: "/review", label: "Review", icon: CheckSquare, badge: pendingCount },
    { to: "/library", label: "Library", icon: Library },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-border">
        <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-lg shadow-primary/30">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">AIVEO3</span>
          <span className="text-[10px] text-muted-foreground">video pipeline</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
        <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </div>
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <Badge variant="default" className="px-1.5 py-0 text-[10px]">
                    {item.badge}
                  </Badge>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-background/60 p-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-brand grid place-items-center text-[10px] font-semibold text-white">
              {channel.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{channel.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {channel.handle} · {(channel.followers / 1000).toFixed(1)}k
              </p>
            </div>
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                paused ? "bg-warning" : "bg-success animate-pulse",
              )}
            />
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          {paused ? "Pipeline paused" : "Pipeline running"} · v0.0.1
        </p>
      </div>
    </aside>
  );
}
