import { z } from "zod";

export const loginValidationSchema = z.object({
  identifier: z
    .string({ required_error: "O usuário é obrigatório" })
    .min(1, "O usuário é obrigatório"),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória"),
});

export type LoginFormInput = z.input<typeof loginValidationSchema>;
