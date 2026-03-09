import { LABELS_STORE_NAME, openDB } from "@/lib/indexeddb-core";

export interface LabelItem {
  id: string;
  name: string;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getLabels(): Promise<LabelItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LABELS_STORE_NAME, "readonly");
    const store = transaction.objectStore(LABELS_STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const labels = (request.result ?? []) as LabelItem[];
      resolve(labels);
    };
  });
}

export async function putLabels(labels: LabelItem[]): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LABELS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(LABELS_STORE_NAME);

    const clearRequest = store.clear();
    clearRequest.onerror = () => reject(clearRequest.error);
    clearRequest.onsuccess = () => {
      if (labels.length === 0) {
        resolve();
        return;
      }

      const putNext = (index: number) => {
        if (index >= labels.length) {
          resolve();
          return;
        }
        const putRequest = store.put(labels[index]);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => {
          putNext(index + 1);
        };
      };

      putNext(0);
    };
  });
}

export async function clearLabels(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LABELS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(LABELS_STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
