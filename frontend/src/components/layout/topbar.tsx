import { Bell, Command as CommandIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0">
          {title ? (
            <h1 className="truncate text-sm font-semibold tracking-tight">{title}</h1>
          ) : null}
          {description ? (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex h-8 w-64 justify-start gap-2 px-3 text-xs text-muted-foreground font-normal"
      >
        <Search className="h-3.5 w-3.5" />
        Tìm video, prompt...
        <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <CommandIcon className="h-2.5 w-2.5" />K
        </kbd>
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8 relative">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      </Button>

      {actions}
    </header>
  );
}
