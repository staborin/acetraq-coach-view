import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mic, Square, CheckCircle2, FileText, Send, Edit3 } from "lucide-react";
import { aiFeedbackDraft, getPlayer, PILLARS, sessionFeedbackHistory, thingsToWorkOn } from "@/lib/data";

export const Route = createFileRoute("/player/$playerId/feedback")({
  component: FeedbackPage,
});

type Stage = "idle" | "recording" | "processing" | "review" | "sent";

function FeedbackPage() {
  const { playerId } = useParams({ from: "/player/$playerId/feedback" });
  const player = getPlayer(playerId)!;
  const [stage, setStage] = useState<Stage>("idle");
  const [seconds, setSeconds] = useState(0);
  const [tab, setTab] = useState<"new" | "history">("new");

  useEffect(() => {
    if (stage !== "recording") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "processing") {
      const id = setTimeout(() => setStage("review"), 1600);
      return () => clearTimeout(id);
    }
  }, [stage]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex rounded-full bg-surface p-1 ring-1 ring-border/60">
        {(["new", "history"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium capitalize ${
              tab === v ? "bg-brand text-brand-foreground" : "text-muted-foreground"
            }`}
          >
            {v === "new" ? "New feedback" : "History"}
          </button>
        ))}
      </div>

      {tab === "new" ? (
        <>
          {stage === "idle" && (
            <RecordingPanel
              title={`Record session feedback for ${player.firstName}`}
              caption="Speak naturally — AceTraq will structure your notes by pillar."
              onStart={() => {
                setSeconds(0);
                setStage("recording");
              }}
            />
          )}
          {stage === "recording" && (
            <RecordingActive
              player={player.firstName}
              time={fmt(seconds)}
              onStop={() => setStage("processing")}
            />
          )}
          {stage === "processing" && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface p-8">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
              <p className="text-sm font-semibold">Transcribing & structuring</p>
              <p className="text-xs text-muted-foreground">Mapping notes to the four pillars…</p>
            </div>
          )}
          {stage === "review" && (
            <ReviewPanel onSend={() => setStage("sent")} />
          )}
          {stage === "sent" && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-rag-green/30 bg-rag-green/10 p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-rag-green" />
              <p className="text-sm font-semibold">Sent to {player.firstName}'s parent</p>
              <p className="text-xs text-muted-foreground">They'll get a notification with the structured feedback.</p>
              <button
                onClick={() => {
                  setStage("idle");
                  setSeconds(0);
                }}
                className="mt-2 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground"
              >
                New recording
              </button>
            </div>
          )}
        </>
      ) : (
        <ul className="space-y-2">
          {sessionFeedbackHistory.map((h) => (
            <li key={h.id} className="rounded-2xl border border-border/60 bg-surface p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{h.date}</p>
                <span className="rounded-full bg-rag-green/15 px-2 py-0.5 text-[10px] font-medium text-rag-green">
                  Sent
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">{h.preview}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RecordingPanel({ title, caption, onStart }: { title: string; caption: string; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface p-8">
      <button
        onClick={onStart}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-xl shadow-brand/30 transition-transform active:scale-95"
        aria-label="Start recording"
      >
        <Mic className="h-10 w-10" />
      </button>
      <p className="mt-2 text-center text-sm font-semibold">{title}</p>
      <p className="text-center text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}

function RecordingActive({ player, time, onStop }: { player: string; time: string; onStop: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-rag-red/30 bg-rag-red/5 p-8">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-rag-red/30" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-rag-red text-white">
          <Mic className="h-9 w-9" />
        </span>
      </div>
      <p className="font-mono text-2xl font-semibold tracking-widest">{time}</p>
      <p className="text-center text-xs text-muted-foreground">
        Recording session notes for <span className="font-semibold text-foreground">{player}…</span>
      </p>
      <button
        onClick={onStop}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background"
      >
        <Square className="h-3 w-3" /> Stop
      </button>
    </div>
  );
}

function ReviewPanel({ onSend }: { onSend: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-brand/10 p-3 text-[12px] text-brand">
        <FileText className="h-4 w-4" />
        AI draft ready — review and edit before sending.
      </div>

      {PILLARS.map((p) => (
        <section key={p} className="rounded-2xl border border-border/60 bg-surface p-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-brand">{p}</p>
            <button className="text-muted-foreground" aria-label="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
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

      <div className="flex gap-2 pt-1">
        <button className="flex-1 rounded-full border border-border bg-surface py-2.5 text-xs font-semibold">
          Save draft
        </button>
        <button
          onClick={onSend}
          className="flex-[1.5] inline-flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-xs font-semibold text-brand-foreground"
        >
          <Send className="h-3.5 w-3.5" /> Send to parent
        </button>
      </div>
    </div>
  );
}
