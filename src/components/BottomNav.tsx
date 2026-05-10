import { Link, useLocation } from "@tanstack/react-router";
import { Home, Calendar, Mic, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/record", label: "Record", icon: Mic, primary: true },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 z-40 mt-auto border-t border-border/60 bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          if (it.primary) {
            return (
              <li key={it.to} className="flex items-center justify-center">
                <Link
                  to={it.to}
                  className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 ring-4 ring-background"
                  aria-label={it.label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-brand" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
