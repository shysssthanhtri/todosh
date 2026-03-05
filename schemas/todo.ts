import z from "zod";

import { TodoModel } from "@/models";

export const TodoSchema = z.object(TodoModel.shape).extend({
  title: z.string().min(3).max(50),
});
