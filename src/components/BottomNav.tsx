import { Link, useLocation } from "@tanstack/react-router";
import { Home, Calendar, Mic, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { pathname } = useLocation();
  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const tabCls = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
      active ? "text-brand" : "text-muted-foreground",
    );

  return (
    <nav className="sticky bottom-0 z-40 mt-auto border-t border-border/60 bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        <li>
          <Link to="/" className={tabCls(isActive("/", true))}>
            <Home className="h-5 w-5" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/calendar" className={tabCls(isActive("/calendar"))}>
            <Calendar className="h-5 w-5" />
            Calendar
          </Link>
        </li>
        <li className="flex items-center justify-center">
          <Link
            to="/record"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 ring-4 ring-background"
            aria-label="Record"
          >
            <Mic className="h-6 w-6" />
          </Link>
        </li>
        <li>
          <Link to="/messages" className={tabCls(isActive("/messages"))}>
            <MessageSquare className="h-5 w-5" />
            Messages
          </Link>
        </li>
        <li>
          <Link to="/profile" className={tabCls(isActive("/profile"))}>
            <User className="h-5 w-5" />
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}
