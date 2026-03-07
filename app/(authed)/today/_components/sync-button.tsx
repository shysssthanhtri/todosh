"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { syncNow } from "@/lib/todo-sync";

const TODO_SYNCED_EVENT = "todo-synced";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
      const toastId = toast.success("Synced", {
        position: "top-center",
        duration: 3000,
      });
      // PWA: list refresh can clear Sonner's timer; we dismiss explicitly so toast always hides
      const dismissMs = 3000;
      setTimeout(() => {
        toast.dismiss(toastId);
      }, dismissMs);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(TODO_SYNCED_EVENT));
      }, 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      toast.error(message, { position: "top-center" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleSync}
      disabled={isSyncing}
      aria-label={isSyncing ? "Syncing…" : "Sync todos"}
    >
      {isSyncing ? (
        <Loader2 className="size-[1.2rem] animate-spin" />
      ) : (
        <RefreshCw className="size-[1.2rem]" />
      )}
    </Button>
  );
}
