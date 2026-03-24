import prismaClient from "../../prisma";

interface DeleteProductServiceProps {
    id: string;
}

class DeleteProductService {
    async execute({ id }: DeleteProductServiceProps) {
        try {
            const product = await prismaClient.product.update({
                where: {
                    id: id,
                },
                data: {
                    disabled: true,
                }
            });

            return { message: "Produto deletado/arquivado com sucesso" };
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao deletar produto");
        }
    }
}

export { DeleteProductService };