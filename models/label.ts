import * as z from "zod";

import { CompleteUser, RelatedUserModel } from "./index";

export const LabelModel = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().nullish(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteLabel extends z.infer<typeof LabelModel> {
  user: CompleteUser;
}

/**
 * RelatedLabelModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLabelModel: z.ZodSchema<CompleteLabel> = z.lazy(() =>
  LabelModel.extend({
    user: RelatedUserModel,
  }),
);
