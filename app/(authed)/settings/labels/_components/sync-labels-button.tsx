"use client";

import { RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { type LabelItem, putLabels } from "@/lib/indexeddb";

interface ApiLabel {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function SyncLabelsButton() {
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/labels", {
          method: "GET",
          credentials: "same-origin",
        });

        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          let message = `Fetch labels failed: ${res.status}`;
          try {
            const data = (await res.json()) as { error?: string };
            if (typeof data?.error === "string") message = data.error;
          } catch {
            // ignore body parse; use default message
          }
          throw new Error(message);
        }

        const apiLabels = (await res.json()) as ApiLabel[];
        const items: LabelItem[] = apiLabels.map((label) => ({
          id: label.id,
          name: label.name,
          color: label.color ?? null,
          createdAt: new Date(label.createdAt),
          updatedAt: new Date(label.updatedAt),
        }));
        await putLabels(items);
        window.dispatchEvent(new CustomEvent(LABELS_UPDATED_EVENT));

        toast.success("Labels synced", { position: "top-center" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to sync labels";
        toast.error(message, { position: "top-center" });
      }
    });
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={handleSync}
      disabled={isPending}
      aria-label={isPending ? "Syncing labels…" : "Sync labels"}
    >
      <RefreshCw className={isPending ? "size-4 animate-spin" : "size-4"} />
    </Button>
  );
}
