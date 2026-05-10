import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  header,
  hideNav,
  className,
}: {
  children: ReactNode;
  header?: ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      {header}
      <main className={cn("flex-1 px-4 pb-28 pt-3", className)}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 w-full items-center gap-2">
          {back && (
            <Link
              to={back}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {right}
        </div>
      </div>
    </header>
  );
}
