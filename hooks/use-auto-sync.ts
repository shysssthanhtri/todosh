"use client";

import { useCallback, useEffect, useRef } from "react";

import { TODO_CHANGED_EVENT, TODO_SYNCED_EVENT } from "@/lib/events";
import { getPending, pullTodos, pushPendingChanges } from "@/lib/todo-sync";

const DEBOUNCE_MS = 2000;
const POLL_INTERVAL_MS = 60_000;

export function useAutoSync() {
  const syncInProgress = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const pollTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  const sync = useCallback(async () => {
    if (syncInProgress.current) return;
    syncInProgress.current = true;
    try {
      await pushPendingChanges();
      await pullTodos();
      window.dispatchEvent(new CustomEvent(TODO_SYNCED_EVENT));
    } catch {
      // Silent for auto-sync; manual SyncButton still shows errors
    } finally {
      syncInProgress.current = false;
    }
  }, []);

  // Debounced sync on local mutation
  useEffect(() => {
    const handler = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(sync, DEBOUNCE_MS);
    };
    window.addEventListener(TODO_CHANGED_EVENT, handler);
    return () => {
      window.removeEventListener(TODO_CHANGED_EVENT, handler);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [sync]);

  // Sync when tab becomes visible
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [sync]);

  // Periodic polling
  useEffect(() => {
    pollTimer.current = setInterval(sync, POLL_INTERVAL_MS);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [sync]);

  // Safety net: push pending via sendBeacon on page close (fire-and-forget; do not clear pending)
  useEffect(() => {
    const handler = () => {
      const pending = getPending();
      const hasPending =
        pending.upserts.length > 0 || pending.deleteIds.length > 0;
      if (!hasPending) return;
      const body = JSON.stringify({
        upserts: pending.upserts.map((t) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          completedAt: t.completedAt?.toISOString() ?? null,
          dueDate: t.dueDate?.toISOString() ?? null,
          labelId: t.labelId ?? null,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
        deleteIds: pending.deleteIds,
      });
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/todos/sync", blob);
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, []);
}
