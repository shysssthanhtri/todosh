import * as z from "zod";

import {
  CompleteLabel,
  CompleteUser,
  RelatedLabelModel,
  RelatedUserModel,
} from "./index";

export const TodoModel = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  completedAt: z.date().nullish(),
  dueDate: z.date().nullish(),
  labelId: z.string().nullish(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TodoType = z.infer<typeof TodoModel>;

export interface CompleteTodo extends z.infer<typeof TodoModel> {
  user: CompleteUser;
  label?: CompleteLabel | null;
}

/**
 * RelatedTodoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTodoModel: z.ZodSchema<CompleteTodo> = z.lazy(() =>
  TodoModel.extend({
    user: RelatedUserModel,
    label: RelatedLabelModel.nullish(),
  }),
);
