import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { Settings, LogOut, Bell, CreditCard } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: () => (
    <MobileShell header={<PageHeader title="Profile" />}>
      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-2/40 p-5 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/15 text-2xl font-semibold text-brand">
          JR
        </div>
        <p className="mt-3 text-base font-semibold">James Reeves</p>
        <p className="text-xs text-muted-foreground">Head Coach · Beckenham TC</p>
      </section>
      <ul className="mt-4 space-y-1.5">
        {[
          { icon: Bell, label: "Notifications" },
          { icon: CreditCard, label: "Billing & payments" },
          { icon: Settings, label: "Settings" },
          { icon: LogOut, label: "Sign out" },
        ].map((it, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-3.5 text-sm">
            <it.icon className="h-4 w-4 text-brand" />
            {it.label}
          </li>
        ))}
      </ul>
    </MobileShell>
  ),
});
