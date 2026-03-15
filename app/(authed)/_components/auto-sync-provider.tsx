"use client";

import { useAutoSync } from "@/hooks/use-auto-sync";

export function AutoSyncProvider({ children }: { children: React.ReactNode }) {
  useAutoSync();
  return <>{children}</>;
}
