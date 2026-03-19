import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string("Nome da categoria deve ser um texto").min(2, "Nome da categoria deve ter pelo menos 2 caracteres"),
    })
})