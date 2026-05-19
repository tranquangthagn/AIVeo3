import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "./command-palette";
import { useAppStore } from "@/store/use-app-store";

function PipelineTicker() {
  const tick = useAppStore((s) => s.tickPipeline);
  React.useEffect(() => {
    const t = setInterval(tick, 1500);
    return () => clearInterval(t);
  }, [tick]);
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
