import prismaClient from "../../prisma/index";

interface RemoveItemOrderServiceProps {
    item_id: string;
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemOrderServiceProps) {
        try {
            // Verifica se o item existe
            const itemExists = await prismaClient.item.findFirst({
                where: {
                    id: item_id,
                },
            });

            if (!itemExists) {
                throw new Error("Item não encontrado");
            }

            // Deleta o item
            await prismaClient.item.delete({
                where: {
                    id: item_id,
                },
            });

            return { message: "Item removido com sucesso" };
        } catch (err) {
            throw new Error("Erro ao remover item");
        }
    }
}

export { RemoveItemOrderService };
