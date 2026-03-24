import z from "zod";

const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        price: z.string().min(1, "Preço é obrigatório").regex(/^\d+$/),
        description: z.string().min(1, "Descrição é obrigatória"),
        category_id: z.string().min(1, "Categoria é obrigatória"),
    })
})

const listProductSchema = z.object({
    query: z.object({
        disabled: z.string().optional()
    })
})

const listProductByCategorySchema = z.object({
    query: z.object({
        category_id: z.string().min(1, "O ID da categoria é obrigatório"),
    })
})

export { createProductSchema, listProductSchema, listProductByCategorySchema };