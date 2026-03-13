import z from "zod";

import { LabelModel } from "@/models";

export const LabelColorEnum = z.enum([
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "gray",
]);

export type LabelColor = z.infer<typeof LabelColorEnum>;

export const LabelSchema = z.object(LabelModel.shape).extend({
  name: z.string().min(3).max(8),
  color: LabelColorEnum.nullish(),
});

export type LabelSchemaType = z.infer<typeof LabelSchema>;
