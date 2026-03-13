import { LabelSchemaType } from "@/schemas/label";
import { TodoSchemaType } from "@/schemas/todo";

export type RichTodoType = Omit<TodoSchemaType, "userId"> & {
  /** Resolved label name for display (from IndexedDB). Set by parent. */
  label?: {
    name: LabelSchemaType["name"];
    color: LabelSchemaType["color"];
  };
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
};
