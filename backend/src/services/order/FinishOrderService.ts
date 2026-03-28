import prismaClient from "../../prisma";

interface FinishOrderProps {
    order_id: string;
}

class FinishOrderService {
    async execute({ order_id }: FinishOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id
                }
            })
            if (!order) {
                throw new Error("falha ao finalizar o pedido")
            }

            const updateOrder = await prismaClient.order.update({
                where: {
                    id: order_id,
                },
                data: {
                    status: true,
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    CreatedAt: true,
                }
            })
            return updateOrder
        } catch (err) {
            console.log(err)
            throw new Error("falha ao enviar o pedido")
        }
    }
}
export { FinishOrderService }