import prismaClient from "../../prisma/index";

class ListCategoryService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    CreatedAt: true,
                },
                orderBy: {
                    name: "desc",
                },
            });

            return categories;
        } catch (err) {
            throw new Error("Erro ao listar categorias");
        }
    }
}

export { ListCategoryService };
