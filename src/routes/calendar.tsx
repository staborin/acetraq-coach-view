import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { players } from "@/lib/data";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

const today = [
  { time: "9:00", player: "Sophie Chen", duration: "60 min" },
  { time: "10:30", player: "James Wilson", duration: "45 min" },
  { time: "16:00", player: "Tom Henderson", duration: "60 min" },
  { time: "17:00", player: "Alex Roberts", duration: "60 min" },
];

function CalendarPage() {
  return (
    <MobileShell header={<PageHeader title="Schedule" subtitle="All players · this week" />}>
      <section className="mb-4 rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-2/40 p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">Today</p>
        <p className="mt-1 text-lg font-semibold">4 sessions · 3.75 hrs</p>
      </section>
      <ul className="space-y-2">
        {today.map((s, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface p-3.5">
            <div className="flex h-12 w-14 flex-col items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Clock className="h-3 w-3" />
              <p className="text-xs font-semibold">{s.time}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{s.player}</p>
              <p className="text-[11px] text-muted-foreground">{s.duration}</p>
            </div>
            <span className="rounded-full bg-rag-green/15 px-2 py-0.5 text-[10px] font-semibold text-rag-green">Confirmed</span>
          </li>
        ))}
      </ul>

      <section className="mt-6">
        <p className="mb-2 text-sm font-semibold">This week</p>
        <div className="rounded-2xl border border-border/60 bg-surface p-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-brand" />
            <span>{players.length * 2} sessions scheduled across {players.length} players</span>
          </div>
        </div>
      </section>
    </MobileShell>
  );
}
