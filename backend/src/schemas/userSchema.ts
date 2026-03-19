import { z } from "zod";
export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "o nome precisa ser um texto" })
      .min(3, { error: "O nome precisa ter no minimo 3 letras" }),
    email: z.email({ error: "Precisa ser um email valido!" }),
    password: z
      .string({ error: "A senha é obrigatória" })
      .min(6, { error: "A senha deve ter no minimo 6 caracteres" }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ error: "Precisa ser um email valido" }),
    password: z
      .string({ error: "A senha é obrigatória" })
      .min(6, { error: "Senha precisa ter mais de 6 caracteres" }),
  }),
});
