import { TodoSchemaType } from "@/schemas/todo";

export type RichTodoType = Omit<TodoSchemaType, "userId"> & {
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
};
