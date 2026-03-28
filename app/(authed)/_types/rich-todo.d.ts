import { TodoType } from "@/models";
import { LabelSchemaType } from "@/schemas/label";

export type UnInteractiveTodoType = Omit<TodoType, "userId"> & {
  /** Resolved label name for display (from IndexedDB). Set by parent. */
  label?: {
    name: LabelSchemaType["name"];
    color: LabelSchemaType["color"];
  };
};

export type RichTodoType = UnInteractiveTodoType & {
  onComplete: () => Promise<void>;
  onDelete: () => Promise<void>;
};
