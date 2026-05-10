import { useLocation } from "@tanstack/react-router";
import { AppLink } from "./AppLink";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "", label: "Dashboard" },
  { key: "/plan", label: "Dev Plan" },
  { key: "/sessions", label: "Sessions" },
  { key: "/feedback", label: "Feedback" },
  { key: "/tournaments", label: "Tournaments" },
  { key: "/homework", label: "Homework" },
];

export function PlayerTabs({ playerId }: { playerId: string }) {
  const { pathname } = useLocation();
  const base = `/player/${playerId}`;
  return (
    <div className="-mx-4 overflow-x-auto border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="flex min-w-max gap-1 px-4 py-2">
        {tabs.map((t) => {
          const href = base + t.key;
          const active = t.key === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={t.key}
              to={href}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
