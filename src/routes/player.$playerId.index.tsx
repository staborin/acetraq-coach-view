import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppLink } from "@/components/AppLink";
import { PillarRadar } from "@/components/PillarRadar";
import { RagPill } from "@/components/Rag";
import { getPlayer, PILLARS } from "@/lib/data";
import { Calendar, Trophy, ClipboardList, Activity, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/")({
  component: Dashboard,
});

const pillarFocus: Record<string, string> = {
  Technical: "Forehand consistency under pressure",
  Tactical: "Net approach in service games",
  Physical: "Endurance through third sets",
  Mental: "Between-point routine consistency",
};

function Dashboard() {
  const { playerId } = useParams({ from: "/player/$playerId/" });
  const player = getPlayer(playerId)!;

  return (
    <div className="space-y-5">
      {/* Hero card with radar */}
      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-2/40 p-4">
        <div className="flex items-center justify-center">
          <PillarRadar pillars={player.pillars} size={240} />
        </div>
        <p className="mt-2 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Four-pillar profile
        </p>
      </section>

      {/* Pillar tiles */}
      <section className="grid grid-cols-2 gap-2.5">
        {PILLARS.map((p) => (
          <div key={p} className="rounded-2xl border border-border/60 bg-surface p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-tight">{p}</p>
              <RagPill rag={player.pillars[p]} />
            </div>
            <p className="mt-2 text-[12px] leading-snug text-muted-foreground">{pillarFocus[p]}</p>
          </div>
        ))}
      </section>

      {/* Current phase */}
      <section className="rounded-2xl border border-border/60 bg-surface p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">Current phase</p>
        <p className="mt-2 text-sm leading-relaxed">{player.currentPhase}</p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-2">
        <QuickStat label="Last session" value={player.lastSession} />
        <QuickStat label="Next session" value={player.nextSession} />
        <QuickStat label="Last tournament" value={player.lastTournament} />
        <QuickStat label="Homework" value={`${player.homeworkCompliance}%`} accent />
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 gap-2">
        <QuickLink to={`/player/${player.id}/plan`} icon={<ClipboardList className="h-4 w-4" />} label="Dev Plan" />
        <QuickLink to={`/player/${player.id}/feedback`} icon={<Activity className="h-4 w-4" />} label="Feedback" />
        <QuickLink to={`/player/${player.id}/sessions`} icon={<Calendar className="h-4 w-4" />} label="Sessions" />
        <QuickLink to={`/player/${player.id}/tournaments`} icon={<Trophy className="h-4 w-4" />} label="Tournaments" />
      </section>

      {/* Recent activity */}
      <section>
        <h3 className="mb-2 text-sm font-semibold">Recent activity</h3>
        <ul className="space-y-2">
          {[
            { t: "Session feedback sent", d: "8 May" },
            { t: "Tournament charting received: Kent Junior Open", d: "3 May" },
            { t: "Homework completed: 50 wall feeds", d: "5 May" },
            { t: "Development plan updated", d: "12 Mar" },
          ].map((it, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-3 text-[13px]">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <p className="flex-1">{it.t}</p>
              <span className="text-[11px] text-muted-foreground">{it.d}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function QuickStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${accent ? "text-brand" : ""}`}>{value}</p>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <AppLink
      to={to}
      className="flex items-center justify-between rounded-xl border border-border/60 bg-surface p-3 text-sm font-medium"
    >
      <span className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </AppLink>
  );
}
