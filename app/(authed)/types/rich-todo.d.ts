import { TodoSchemaType } from "@/schemas/todo";

export type RichTodoType = Omit<TodoSchemaType, "userId"> & {
  /** Resolved label name for display (from IndexedDB). Set by parent. */
  labelName?: string | null;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
};
