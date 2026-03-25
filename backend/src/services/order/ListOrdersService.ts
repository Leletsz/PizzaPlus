import prismaClient from "../../prisma";
interface ListOrderServiceProps {
    draft?: string
}
class ListOrderService {
    async execute({ draft }: ListOrderServiceProps) {
        try {
            const orders = await prismaClient.order.findMany({
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    CreatedAt: true,
                    items: {
                        select: {
                            id: true,
                            amount: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    description: true,
                                    banner: true,
                                }
                            }
                        }
                    }
                },
                where: {
                    draft: draft === "true" ? true : false,
                },
                orderBy: {
                    CreatedAt: "desc",
                },
            });

            return orders;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Erro ao listar pedidos");
        }
    }
}

export { ListOrderService };