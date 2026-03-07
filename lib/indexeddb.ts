const DB_NAME = "todosh";
const DB_VERSION = 1;
const STORE_NAME = "todos";

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("completed", "completed", { unique: false });
      }
    };
  });
}

export async function addTodo(
  todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt">,
): Promise<TodoItem> {
  const db = await openDB();
  const newTodo: TodoItem = {
    ...todo,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newTodo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newTodo);
  });
}

export async function getAllTodos(): Promise<TodoItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function updateTodo(
  id: string,
  updates: Partial<Omit<TodoItem, "id" | "createdAt">>,
): Promise<TodoItem> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const todo = getRequest.result as TodoItem;
      if (!todo) {
        reject(new Error("Todo not found"));
        return;
      }

      const updatedTodo: TodoItem = {
        ...todo,
        ...updates,
        updatedAt: new Date(),
      };

      const putRequest = store.put(updatedTodo);
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve(updatedTodo);
    };
  });
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/** Clears all todos from the store. Used on sign-out so the next user does not see them. */
export async function clearTodos(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/** Puts a todo by id (insert or overwrite). Used by sync merge. */
export async function putTodo(todo: TodoItem): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(todo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
