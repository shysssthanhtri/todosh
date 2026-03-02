import z from "zod";

export const credentialSchema = z.object({
  email: z.email(),
  password: z.string(),
});
