import z from "zod";

export const loginCredentialSchema = z.object({
  email: z.email(),
  password: z.string(),
});
