import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AppLink } from "@/components/AppLink";
import { RagDot, RagPill } from "@/components/Rag";
import {
  getPlayer,
  kentOpenMatches,
  pairings,
  tournaments,
  PILLARS,
  type Pillar,
  type RAG,
} from "@/lib/data";
import { ArrowLeft, Calendar, MapPin, Sparkles, CheckCircle2, Mic } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/tournaments/$tournamentId")({
  component: TournamentDetail,
});

function TournamentDetail() {
  const { playerId, tournamentId } = useParams({ from: "/player/$playerId/tournaments/$tournamentId" });
  const player = getPlayer(playerId)!;
  const tournament = tournaments.find((t) => t.id === tournamentId)!;

  return (
    <div className="space-y-4">
      <AppLink
        to={`/player/${playerId}/tournaments`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All tournaments
      </AppLink>

      <header className="rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-2/40 p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">{tournament.state.replace("-", " ")}</p>
        <h2 className="mt-1 text-lg font-semibold">{tournament.name}</h2>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{tournament.date}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{tournament.venue}</span>
        </div>
        {tournament.results && (
          <p className="mt-2 text-sm font-semibold">Result · {tournament.results}</p>
        )}
      </header>

      {tournament.state === "set-goals" && <GoalSetting playerName={player.firstName} />}
      {tournament.state === "review" && <ReviewView />}
      {tournament.state === "reviewed" && <ReviewedSummary />}
    </div>
  );
}

function GoalSetting({ playerName }: { playerName: string }) {
  const [selected, setSelected] = useState<string[]>(["pa3", "pa5"]);
  const [submitted, setSubmitted] = useState(false);
  const toggle = (id: string) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s,
    );
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rag-green/30 bg-rag-green/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-rag-green" />
        <p className="text-sm font-semibold">Goals submitted</p>
        <p className="text-xs text-muted-foreground">
          Sent to parent. Don't forget to share these targets with {playerName} before the tournament.
        </p>
      </div>
    );
  }

  const byPillar: Record<Pillar, typeof pairings> = { Technical: [], Tactical: [], Physical: [], Mental: [] };
  pairings.forEach((p) => byPillar[p.pillar].push(p));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-3 text-[12px]">
        <p className="font-semibold text-brand">Select 2–3 target / observation pairings</p>
        <p className="mt-1 text-muted-foreground">
          {selected.length}/3 selected. Recommended pairings highlighted based on the development plan.
        </p>
      </div>

      {PILLARS.map((p) =>
        byPillar[p].length === 0 ? null : (
          <section key={p}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{p}</p>
            <ul className="space-y-2">
              {byPillar[p].map((pair) => {
                const active = selected.includes(pair.id);
                return (
                  <li key={pair.id}>
                    <button
                      onClick={() => toggle(pair.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                        active
                          ? "border-brand bg-brand/10"
                          : "border-border/60 bg-surface hover:bg-surface-2"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            active ? "border-brand bg-brand text-brand-foreground" : "border-border"
                          }`}
                        >
                          {active && <CheckCircle2 className="h-3 w-3" />}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-semibold">{pair.category}</p>
                            {pair.recommended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold text-brand">
                                <Sparkles className="h-2.5 w-2.5" /> Recommended
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[12px] leading-snug">
                            <span className="font-medium">Target:</span> {pair.target}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            <span className="font-medium">Parent tracks:</span> {pair.observation}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ),
      )}

      <button
        disabled={selected.length === 0}
        onClick={() => setSubmitted(true)}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground disabled:opacity-50"
      >
        Submit goals & share with {playerName}
      </button>
    </div>
  );
}

function ReviewView() {
  const [rags, setRags] = useState<Record<string, RAG>>(() => {
    const init: Record<string, RAG> = {};
    kentOpenMatches.forEach((m) => m.pairings.forEach((p, i) => (init[`${m.opponent}-${i}`] = p.rag)));
    return init;
  });
  const [reviewed, setReviewed] = useState(false);
  const cycle: Record<RAG, RAG> = { green: "amber", amber: "red", red: "green" };

  if (reviewed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rag-green/30 bg-rag-green/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-rag-green" />
        <p className="text-sm font-semibold">Tournament reviewed</p>
        <p className="text-xs text-muted-foreground">Insights flowed back into the development plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-rag-amber/40 bg-rag-amber/5 p-3 text-[12px] text-rag-amber">
        Charting data received from parent — assess each target and complete the review.
      </div>

      {kentOpenMatches.map((m, mi) => (
        <section key={mi} className="rounded-2xl border border-border/60 bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">vs. {m.opponent}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                m.result === "W" ? "bg-rag-green/15 text-rag-green" : "bg-rag-red/15 text-rag-red"
              }`}
            >
              {m.result === "W" ? "Won" : "Lost"} {m.score}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {m.pairings.map((p, i) => {
              const pair = pairings.find((pp) => pp.id === p.pairingId)!;
              const key = `${m.opponent}-${i}`;
              const rag = rags[key];
              return (
                <li key={i} className="rounded-xl bg-surface-2/50 p-3 ring-1 ring-border/40">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand">{pair.category}</p>
                  <p className="mt-0.5 text-[12px]">{pair.target}</p>
                  <p className="mt-1.5 rounded-md bg-background/60 px-2 py-1.5 text-[12px] font-medium">{p.data}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coach RAG</p>
                    <button onClick={() => setRags((r) => ({ ...r, [key]: cycle[rag] }))}>
                      <RagDot rag={rag} size={12} />
                    </button>
                    <RagPill rag={rag} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-border/60 bg-surface p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Coach notes</p>
        <textarea
          rows={3}
          placeholder="Overall reflections from the tournament…"
          className="mt-2 w-full resize-none rounded-lg bg-surface-2/60 p-2.5 text-[13px] outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-brand"
        />
        <button className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
          <Mic className="h-3 w-3" /> Add voice note instead
        </button>
      </section>

      <button
        onClick={() => setReviewed(true)}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground"
      >
        Mark as reviewed
      </button>
    </div>
  );
}

function ReviewedSummary() {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-4 text-sm">
      <p className="font-semibold">Reviewed on 14 April 2026</p>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Strong forehand patterns held up well over three matches. Mental routine slipped in the final-set tiebreak — added to the development plan as a watch-point.
      </p>
    </div>
  );
}
