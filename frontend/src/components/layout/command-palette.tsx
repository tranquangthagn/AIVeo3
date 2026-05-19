import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Workflow,
  CheckSquare,
  Library,
  BarChart3,
  Settings,
  Play,
  Pause,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { useAppStore } from "@/store/use-app-store";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const reviewQueue = useAppStore((s) => s.reviewQueue);
  const generateNow = useAppStore((s) => s.generateNow);
  const paused = useAppStore((s) => s.config.paused);
  const pausePipeline = useAppStore((s) => s.pausePipeline);
  const resumePipeline = useAppStore((s) => s.resumePipeline);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Tìm trang, video, hoặc gõ lệnh..." />
      <CommandList>
        <CommandEmpty>Không có kết quả.</CommandEmpty>
        <CommandGroup heading="Trang">
          <CommandItem onSelect={() => go("/")}>
            <LayoutDashboard /> Dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/pipeline")}>
            <Workflow /> Pipeline Config
          </CommandItem>
          <CommandItem onSelect={() => go("/review")}>
            <CheckSquare /> Review queue
            <CommandShortcut>{reviewQueue.length} pending</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/library")}>
            <Library /> Library
          </CommandItem>
          <CommandItem onSelect={() => go("/analytics")}>
            <BarChart3 /> Analytics
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Hành động">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              generateNow();
              toast.success("Đã queue 1 video mới", { description: "Pipeline bắt đầu generate idea..." });
            }}
          >
            <Play /> Gen video ngay
          </CommandItem>
          {paused ? (
            <CommandItem
              onSelect={() => {
                setOpen(false);
                resumePipeline();
                toast.success("Pipeline đã resume");
              }}
            >
              <Play /> Resume pipeline
            </CommandItem>
          ) : (
            <CommandItem
              onSelect={() => {
                setOpen(false);
                pausePipeline();
                toast("Pipeline đã pause", { description: "Click resume để tiếp tục" });
              }}
            >
              <Pause /> Pause pipeline
            </CommandItem>
          )}
        </CommandGroup>

        {reviewQueue.length > 0 ? (
          <CommandGroup heading="Review queue">
            {reviewQueue.map((job) => (
              <CommandItem key={job.id} onSelect={() => go(`/review/${job.id}`)}>
                <span className="font-mono text-[10px] text-muted-foreground">{job.id}</span>
                <span className="ml-2 truncate">{job.title}</span>
                <CommandShortcut>AI {job.aiScore}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
