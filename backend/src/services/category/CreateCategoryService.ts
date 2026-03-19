import prismaClient from "../../prisma/index";

interface CreateCategoryProps {
    name: string;
}
class CreateCategoryService {
    async execute({ name }: CreateCategoryProps) {
        try {
            const category = await prismaClient.category.create({
                data: {
                    name,
                },
                select: {
                    id: true,
                    name: true,
                    CreatedAt: true,
                }
            })
            return category;
        } catch (err) {
            throw new Error("Erro ao criar categoria");
        }

    }
}
export { CreateCategoryService };