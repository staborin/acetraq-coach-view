import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { players, PILLARS, aiFeedbackDraft, thingsToWorkOn, getPlayer } from "@/lib/data";
import { Mic, Square, CheckCircle2, Send, Edit3, FileText } from "lucide-react";

export const Route = createFileRoute("/record")({
  validateSearch: (s: Record<string, unknown>) => ({ player: (s.player as string) || "" }),
  component: RecordPage,
});

type Stage = "pick" | "recording" | "processing" | "review" | "sent";

function RecordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(search.player);
  const [stage, setStage] = useState<Stage>(search.player ? "recording" : "pick");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (stage !== "recording") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "processing") {
      const t = setTimeout(() => setStage("review"), 1600);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const player = getPlayer(playerId);
  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <MobileShell header={<PageHeader title="Log session" subtitle={player?.name ?? "Choose player"} showBack />}>
      {stage === "pick" && (
        <div className="space-y-2">
          <p className="mb-2 text-sm font-semibold">Who are we logging for?</p>
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPlayerId(p.id);
                navigate({ to: "/record", search: { player: p.id } });
                setStage("recording");
                setSeconds(0);
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-surface p-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand">
                {p.firstName[0]}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.ageGroup}</p>
              </div>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {stage === "recording" && player && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-rag-red/30 bg-rag-red/5 p-8">
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-rag-red/30" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-rag-red text-white">
              <Mic className="h-10 w-10" />
            </span>
          </div>
          <p className="font-mono text-3xl font-semibold tracking-widest">{fmt(seconds)}</p>
          <p className="text-center text-xs text-muted-foreground">
            Recording session notes for{" "}
            <span className="font-semibold text-foreground">{player.firstName}…</span>
          </p>
          <button
            onClick={() => setStage("processing")}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        </div>
      )}

      {stage === "processing" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface p-10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="text-sm font-semibold">Transcribing & structuring</p>
          <p className="text-xs text-muted-foreground">Mapping your notes to the four pillars…</p>
        </div>
      )}

      {stage === "review" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-brand/10 p-3 text-[12px] text-brand">
            <FileText className="h-4 w-4" /> AI draft ready — review before sending.
          </div>
          {PILLARS.map((p) => (
            <section key={p} className="rounded-2xl border border-border/60 bg-surface p-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">{p}</p>
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-[13px] leading-relaxed">{aiFeedbackDraft[p]}</p>
            </section>
          ))}
          <section className="rounded-2xl border border-rag-amber/40 bg-rag-amber/5 p-3.5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-rag-amber">Things to work on</p>
            <ul className="space-y-1.5">
              {thingsToWorkOn.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rag-amber" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
          <button
            onClick={() => setStage("sent")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground"
          >
            <Send className="h-4 w-4" /> Send to parent
          </button>
        </div>
      )}

      {stage === "sent" && player && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rag-green/30 bg-rag-green/10 p-10 text-center">
          <CheckCircle2 className="h-12 w-12 text-rag-green" />
          <p className="text-sm font-semibold">Sent to {player.firstName}'s parent</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
          >
            Back to home
          </button>
        </div>
      )}
    </MobileShell>
  );
}
