import { z } from "zod";

export const AuthSchema = z.object({
  name: z.string().min(1, "Required"),
  password: z.string().min(8, "At least 8 characters"),
});

export const GoogleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url().optional(),
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;
export type GoogleUserType = z.infer<typeof GoogleUserSchema>;
