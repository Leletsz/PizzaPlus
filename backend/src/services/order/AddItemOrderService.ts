import prismaClient from "../../prisma/index";

interface AddItemOrderServiceProps {
    order_id: string;
    product_id: string;
    amount: number;
}

class AddItemOrderService {
    async execute({ order_id, product_id, amount }: AddItemOrderServiceProps) {
        try {

            //Verifica se tem a order
            const orderExists = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                },
            });
            if (!orderExists) {
                throw new Error("Order não encontrada");
            }

            //Verifica se tem o produto
            const productExists = await prismaClient.product.findFirst({
                where: {
                    id: product_id,
                },
            });
            if (!productExists) {
                throw new Error("Produto não encontrado");
            }

            //Adiciona o item ao pedido
            const item = await prismaClient.item.create({
                data: {
                    order_id: order_id,
                    product_id: product_id,
                    amount: amount,
                },
                select: {
                    id: true,
                    order_id: true,
                    product_id: true,
                    amount: true,
                    CreatedAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            banner: true,
                            description: true,
                        }
                    }
                }
            });
            return item;
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao adicionar item ao pedido");
        }
    }
}

export { AddItemOrderService };