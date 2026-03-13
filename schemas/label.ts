import z from "zod";

import { LabelModel } from "@/models";

export const LabelSchema = z.object(LabelModel.shape).extend({
  name: z.string().min(3).max(8),
});
export type LabelSchemaType = z.infer<typeof LabelSchema>;
