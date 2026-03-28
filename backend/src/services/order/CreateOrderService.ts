import prismaClient from "../../prisma/index";

interface CreateOrderServiceProps {
  table: number;
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table: table,
          name: name ?? "",
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          CreatedAt: true,
        },
      });
      return order;
    } catch (err) {
      throw new Error("Erro ao criar pedido");
    }
  }
}

export { CreateOrderService };
