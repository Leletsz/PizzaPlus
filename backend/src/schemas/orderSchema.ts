import z from "zod";

const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number("O número da mesa é obrigatório")
      .int("O número da mesa deve ser um número inteiro")
      .positive("O número da mesa deve ser um número positivo"),
    name: z.string().optional(),
  }),
});

const addItemSchema = z.object({
  body: z.object({
    amount: z.number("A quantidade é obrigatória").int("A quantidade deve ser um número inteiro").positive("A quantidade deve ser um número positivo"),
    product_id: z.string("O produto é obrigatório").min(1, "O produto é obrigatório"),
    order_id: z.string("A ordem é obrigatória").min(1, "A ordem é obrigatória"),
  }),
});

const removeItemSchema = z.object({
  query: z.object({
    item_id: z.string("O item é obrigatório").min(1, "O item é obrigatório"),
  }),
});

export { createOrderSchema, addItemSchema, removeItemSchema };
