import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/messages")({
  component: () => (
    <MobileShell header={<PageHeader title="Messages" subtitle="Parent communication" />}>
      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface p-10 text-center">
        <MessageSquare className="h-10 w-10 text-brand" />
        <p className="text-sm font-semibold">Parent messaging coming soon</p>
        <p className="text-xs text-muted-foreground">A unified feed for parent communication across your squad.</p>
      </div>
    </MobileShell>
  ),
});
