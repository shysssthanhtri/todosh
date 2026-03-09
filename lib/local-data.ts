import {
  PENDING_KEY,
  SERVER_KNOWN_IDS_KEY,
} from "@/constants/local-storage-keys";
import { clearLabels, clearTodos } from "@/lib/indexeddb";

/**
 * Clears all local todo-related data:
 * - Sync pending state in localStorage
 * - Known server IDs in localStorage
 * - Todos and labels in IndexedDB
 *
 * Call on sign-out so the next user does not see the previous user's data.
 */
export async function clearLocalData(): Promise<void> {
  if (typeof window === "undefined") return;
  const storage = window.localStorage;
  storage.removeItem(PENDING_KEY);
  storage.removeItem(SERVER_KNOWN_IDS_KEY);
  await clearTodos();
  await clearLabels();
}
