import * as z from "zod";

import { CompleteUser, RelatedUserModel } from "./index";

export const TodoModel = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteTodo extends z.infer<typeof TodoModel> {
  user: CompleteUser;
}

/**
 * RelatedTodoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTodoModel: z.ZodSchema<CompleteTodo> = z.lazy(() =>
  TodoModel.extend({
    user: RelatedUserModel,
  }),
);
