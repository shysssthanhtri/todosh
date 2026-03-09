const DB_NAME = "todosh";
const DB_VERSION = 3;
export const TODO_STORE_NAME = "todos-store";
export const LABELS_STORE_NAME = "labels-store";

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (db.objectStoreNames.contains(TODO_STORE_NAME)) {
        db.deleteObjectStore(TODO_STORE_NAME);
      }
      const todoStore = db.createObjectStore(TODO_STORE_NAME, {
        keyPath: "id",
      });
      todoStore.createIndex("dueDate", "dueDate", { unique: false });

      if (!db.objectStoreNames.contains(LABELS_STORE_NAME)) {
        db.createObjectStore(LABELS_STORE_NAME, { keyPath: "id" });
      }
    };
  });
}
