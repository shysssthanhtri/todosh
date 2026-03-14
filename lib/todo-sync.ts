import {
  PENDING_KEY,
  SERVER_KNOWN_IDS_KEY,
} from "@/constants/local-storage-keys";
import { deleteTodo, putTodo, type TodoItem } from "@/lib/indexeddb";
import type { TodoSchemaType } from "@/schemas/todo";

/** Pending upsert shape: TodoSchema fields minus userId (sync is per-user). Includes completedAt when recording a completion. */
type PendingTodo = Omit<TodoSchemaType, "userId">;

/** JSON-serialized form of PendingTodo (Date → string). */
type PendingTodoSerialized = {
  [K in keyof PendingTodo]: PendingTodo[K] extends Date
    ? string
    : PendingTodo[K] extends Date | undefined | null
      ? string | null
      : PendingTodo[K];
};

type PendingSerialized = {
  upserts: PendingTodoSerialized[];
  deleteIds: string[];
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function parseTodo(raw: PendingSerialized["upserts"][0]): PendingTodo {
  return {
    id: raw.id,
    title: raw.title,
    completed: raw.completed,
    completedAt: raw.completedAt ? new Date(raw.completedAt) : undefined,
    dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
    labelId: raw.labelId ?? undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export function getPending(): { upserts: PendingTodo[]; deleteIds: string[] } {
  const storage = getStorage();
  if (!storage) return { upserts: [], deleteIds: [] };

  try {
    const raw = storage.getItem(PENDING_KEY);
    if (!raw) return { upserts: [], deleteIds: [] };
    const parsed = JSON.parse(raw) as PendingSerialized;
    return {
      upserts: (parsed.upserts ?? []).map(parseTodo),
      deleteIds: Array.isArray(parsed.deleteIds) ? parsed.deleteIds : [],
    };
  } catch {
    return { upserts: [], deleteIds: [] };
  }
}

function setPending(pending: {
  upserts: PendingTodo[];
  deleteIds: string[];
}): void {
  const storage = getStorage();
  if (!storage) return;

  const serialized: PendingSerialized = {
    upserts: pending.upserts.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      completedAt: t.completedAt?.toISOString() ?? null,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      labelId: t.labelId ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    deleteIds: pending.deleteIds,
  };
  storage.setItem(PENDING_KEY, JSON.stringify(serialized));
}

function getServerKnownIds(): string[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(SERVER_KNOWN_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setServerKnownIds(ids: string[]): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(SERVER_KNOWN_IDS_KEY, JSON.stringify(ids));
}

/** Todo shape for pending upserts; may include completedAt when recording a completion. */
export function recordUpsert(todo: PendingTodo): void {
  const pending = getPending();
  const upserts = pending.upserts.filter((u) => u.id !== todo.id);
  upserts.push(todo);
  const deleteIds = pending.deleteIds.filter((id) => id !== todo.id);
  setPending({ upserts, deleteIds });
}

export function recordDelete(id: string): void {
  const pending = getPending();
  const upserts = pending.upserts.filter((u) => u.id !== id);
  const deleteIds = pending.deleteIds.includes(id)
    ? pending.deleteIds
    : [...pending.deleteIds, id];
  setPending({ upserts, deleteIds });
}

type ServerTodo = {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string | null;
  dueDate: string | null;
  labelId?: string | null;
  createdAt: string;
  updatedAt: string;
};

function serverTodoToItem(t: ServerTodo): TodoItem {
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
    labelId: t.labelId ?? undefined,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  };
}

async function merge(serverTodos: ServerTodo[]): Promise<void> {
  const serverIds = new Set(serverTodos.map((t) => t.id));
  const previousKnownIds = getServerKnownIds();

  for (const t of serverTodos) {
    if (!t.completed) {
      await putTodo(serverTodoToItem(t));
    } else {
      await deleteTodo(t.id);
    }
  }

  for (const id of previousKnownIds) {
    if (!serverIds.has(id)) {
      await deleteTodo(id);
    }
  }

  setServerKnownIds([...serverIds]);
}

/** Pushes local pending changes (upserts + deletes) to the server. No-op if nothing is pending. */
export async function pushPendingChanges(): Promise<void> {
  const pending = getPending();
  const hasPending = pending.upserts.length > 0 || pending.deleteIds.length > 0;
  if (!hasPending) return;

  const res = await fetch("/api/todos/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
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
    }),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    let message = `Sync failed: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // ignore body parse; use default message
    }
    throw new Error(message);
  }

  setPending({ upserts: [], deleteIds: [] });
}

/** Fetches todos from the server and merges them into local IndexedDB. */
export async function pullTodos(): Promise<void> {
  const listRes = await fetch("/api/todos", { credentials: "same-origin" });

  if (listRes.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!listRes.ok) {
    let message = `Fetch todos failed: ${listRes.status}`;
    try {
      const data = (await listRes.json()) as { error?: string };
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // ignore body parse; use default message
    }
    throw new Error(message);
  }

  const serverTodos = (await listRes.json()) as ServerTodo[];
  await merge(serverTodos);
}
