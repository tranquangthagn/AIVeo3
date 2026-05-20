import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "./command-palette";
import { api } from "@/lib/api";

function PipelineTicker() {
  React.useEffect(() => {
    const t = setInterval(() => {
      api.tickPipeline().catch(() => {});
    }, 1500);
    return () => clearInterval(t);
  }, []);
  return null;
}

export function AppShell() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <CommandPalette />
      <PipelineTicker />
    </TooltipProvider>
  );
}
