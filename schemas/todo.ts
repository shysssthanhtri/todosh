import z from "zod";

import { TodoModel } from "@/models/todo";

export const TodoSchema = z.object(TodoModel.shape).extend({
  title: z.string().min(3).max(50),
});

export type TodoSchemaType = z.infer<typeof TodoSchema>;
