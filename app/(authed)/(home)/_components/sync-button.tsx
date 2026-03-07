"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { syncNow } from "@/lib/todo-sync";

const TODO_SYNCED_EVENT = "todo-synced";

export function SyncButton() {
  const { status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);

  if (status !== "authenticated") return null;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
      toast.success("Synced", { position: "top-center" });
      window.dispatchEvent(new CustomEvent(TODO_SYNCED_EVENT));
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
