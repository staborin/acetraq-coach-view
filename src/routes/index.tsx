import { createFileRoute } from "@tanstack/react-router";
import { AppLink } from "@/components/AppLink";
import { MobileShell } from "@/components/MobileShell";
import { RagDot } from "@/components/Rag";
import { players, alerts, PILLARS } from "@/lib/data";
import { Bell, ChevronRight, Mic, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AceTraq — Coach Dashboard" },
      { name: "description", content: "Coaching intelligence for competitive junior tennis." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <MobileShell>
      {/* Hero header */}
      <header className="-mx-4 -mt-3 mb-4 bg-gradient-to-b from-surface to-background px-4 pb-5 pt-[max(env(safe-area-inset-top),12px)]">
        <div className="flex items-center justify-between pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-brand">AceTraq</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">Good morning, Coach</h1>
            <p className="mt-1 text-xs text-muted-foreground">{today}</p>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-surface-2/70 p-3 ring-1 ring-border/50">
          <Stat label="Players" value={String(players.length)} />
          <Stat label="Sessions today" value="4" />
          <Stat label="Action items" value="6" tone="brand" />
        </div>
      </header>

      {/* Alerts */}
      <section className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Needs attention</h2>
          <button className="text-[11px] font-medium text-muted-foreground">View all</button>
        </div>
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface p-3"
            >
              <span
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  a.tone === "warn" ? "bg-rag-amber/15 text-rag-amber" : "bg-brand/15 text-brand"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
              </span>
              <p className="flex-1 text-[13px] leading-snug text-foreground">{a.text}</p>
              {a.playerId && (
                <AppLink
                  to={`/player/${a.playerId}`}
                  className="text-muted-foreground"
                  aria-label="Open player"
                >
                  <ChevronRight className="h-4 w-4" />
                </AppLink>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Roster */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Squad</h2>
          <span className="text-[11px] text-muted-foreground">{players.length} players</span>
        </div>
        <ul className="space-y-2.5">
          {players.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-border/60 bg-surface p-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AppLink to={`/player/${p.id}`} className="flex flex-1 items-start gap-3">
                  <Avatar name={p.firstName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[15px] font-semibold">{p.name}</p>
                      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {p.ageGroup}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      {PILLARS.map((pl) => (
                        <RagDot key={pl} rag={p.pillars[pl]} size={8} />
                      ))}
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        T · Ta · P · M
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Next: {p.nextSession}
                    </p>
                  </div>
                </AppLink>
                <div className="flex flex-col items-end gap-2">
                  {p.attentionItems > 0 && (
                    <span className="rounded-full bg-rag-amber/15 px-2 py-0.5 text-[10px] font-semibold text-rag-amber">
                      {p.attentionItems} item{p.attentionItems > 1 ? "s" : ""}
                    </span>
                  )}
                  <AppLink
                    to={`/record?player=${p.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"
                  >
                    <Mic className="h-3 w-3" /> Log
                  </AppLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </MobileShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "brand" }) {
  return (
    <div className="rounded-xl bg-surface px-2.5 py-2">
      <p
        className={`text-lg font-semibold leading-tight ${
          tone === "brand" ? "text-brand" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.slice(0, 1);
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/40 to-brand/10 text-[15px] font-semibold text-foreground ring-1 ring-border/60">
      {initial}
    </div>
  );
}
