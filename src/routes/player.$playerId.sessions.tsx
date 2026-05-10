import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { sessions, type Session } from "@/lib/data";
import { Calendar, CheckCircle2, AlertCircle, XCircle, CreditCard } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/sessions")({
  component: SessionsPage,
});

function SessionsPage() {
  useParams({ from: "/player/$playerId/sessions" });
  const [view, setView] = useState<"list" | "calendar">("list");
  const [data, setData] = useState(sessions);

  const upcoming = data.filter((s) => !s.past);
  const past = data.filter((s) => s.past);

  const stats = {
    total: data.length,
    confirmed: data.filter((s) => s.status === "confirmed").length,
    unconfirmed: data.filter((s) => s.status === "unconfirmed").length,
    cancelled: data.filter((s) => s.status === "cancelled").length,
    unpaid: data.filter((s) => !s.paid && s.status !== "cancelled").length,
  };

  const updateStatus = (id: string, status: Session["status"]) => {
    setData((d) => d.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex rounded-full bg-surface p-1 ring-1 ring-border/60">
        {(["list", "calendar"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium capitalize ${
              view === v ? "bg-brand text-brand-foreground" : "text-muted-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-1.5 rounded-xl bg-surface p-2 ring-1 ring-border/60">
        <Mini label="Total" value={stats.total} />
        <Mini label="Conf" value={stats.confirmed} tone="green" />
        <Mini label="Pend" value={stats.unconfirmed} tone="amber" />
        <Mini label="Canc" value={stats.cancelled} tone="red" />
        <Mini label="Unpaid" value={stats.unpaid} tone="amber" />
      </div>

      {view === "list" ? (
        <>
          <h3 className="text-sm font-semibold">Upcoming</h3>
          <ul className="space-y-2">
            {upcoming.map((s) => (
              <SessionCard key={s.id} session={s} onUpdate={updateStatus} />
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold text-muted-foreground">Past</h3>
          <ul className="space-y-2 opacity-70">
            {past.map((s) => (
              <SessionCard key={s.id} session={s} onUpdate={updateStatus} />
            ))}
          </ul>
        </>
      ) : (
        <CalendarView sessions={data} />
      )}
    </div>
  );
}

function statusMeta(s: Session["status"]) {
  if (s === "confirmed") return { icon: CheckCircle2, color: "text-rag-green", bg: "bg-rag-green/15", label: "Confirmed" };
  if (s === "unconfirmed") return { icon: AlertCircle, color: "text-rag-amber", bg: "bg-rag-amber/15", label: "Unconfirmed" };
  return { icon: XCircle, color: "text-rag-red", bg: "bg-rag-red/15", label: "Cancelled" };
}

function SessionCard({
  session,
  onUpdate,
}: {
  session: Session;
  onUpdate: (id: string, s: Session["status"]) => void;
}) {
  const meta = statusMeta(session.status);
  const Icon = meta.icon;
  const cancelled = session.status === "cancelled";
  return (
    <li className="rounded-2xl border border-border/60 bg-surface p-3.5">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${cancelled ? "line-through text-muted-foreground" : ""}`}>
            {session.day} {session.date}
          </p>
          <p className="text-[12px] text-muted-foreground">{session.time}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}>
              {meta.label}
            </span>
            {!cancelled && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  session.paid ? "bg-rag-green/15 text-rag-green" : "bg-rag-amber/15 text-rag-amber"
                }`}
              >
                <CreditCard className="h-2.5 w-2.5" />
                {session.paid ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>
        </div>
      </div>
      {!cancelled && !session.past && (
        <div className="mt-3 flex gap-2">
          {session.status !== "confirmed" && (
            <button
              onClick={() => onUpdate(session.id, "confirmed")}
              className="flex-1 rounded-full bg-brand py-1.5 text-xs font-semibold text-brand-foreground"
            >
              Confirm
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Cancel this session? The parent will be notified.")) {
                onUpdate(session.id, "cancelled");
              }
            }}
            className="flex-1 rounded-full border border-border bg-surface-2 py-1.5 text-xs font-medium text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      )}
      {cancelled && (
        <div className="mt-3 rounded-lg bg-surface-2 p-2 text-[11px]">
          <p className="mb-1.5 text-muted-foreground">Promote this slot to other players?</p>
          <div className="flex gap-2">
            <button className="flex-1 rounded-full bg-brand py-1 text-[11px] font-semibold text-brand-foreground">Yes, promote</button>
            <button className="flex-1 rounded-full border border-border py-1 text-[11px]">No</button>
          </div>
        </div>
      )}
    </li>
  );
}

function Mini({ label, value, tone }: { label: string; value: number; tone?: "green" | "amber" | "red" }) {
  const color = tone === "green" ? "text-rag-green" : tone === "amber" ? "text-rag-amber" : tone === "red" ? "text-rag-red" : "";
  return (
    <div className="text-center">
      <p className={`text-base font-bold ${color}`}>{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function CalendarView({ sessions }: { sessions: Session[] }) {
  // Static May 2026 grid
  const days: (number | null)[] = [];
  // May 1 2026 is a Friday; leading 5 blanks (Sun-Thu)
  for (let i = 0; i < 5; i++) days.push(null);
  for (let i = 1; i <= 31; i++) days.push(i);

  const dayMap: Record<number, Session> = {};
  sessions.forEach((s) => {
    const m = s.date.match(/(\d+)/);
    if (m) dayMap[Number(m[1])] = s;
  });

  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Calendar className="h-4 w-4 text-brand" /> May 2026
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <p key={i} className="text-[10px] font-semibold text-muted-foreground">{d}</p>
        ))}
        {days.map((d, i) => {
          const s = d ? dayMap[d] : undefined;
          const tone = s ? statusMeta(s.status) : null;
          return (
            <div
              key={i}
              className={`relative aspect-square rounded-lg text-[11px] ${
                d ? "bg-surface-2/40" : ""
              } ${s ? "ring-1 ring-border/60" : ""}`}
            >
              {d && (
                <>
                  <p className="absolute left-1.5 top-1 text-foreground/80">{d}</p>
                  {s && tone && (
                    <span
                      className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                        s.status === "confirmed" ? "bg-rag-green" : s.status === "unconfirmed" ? "bg-rag-amber" : "bg-rag-red"
                      }`}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
