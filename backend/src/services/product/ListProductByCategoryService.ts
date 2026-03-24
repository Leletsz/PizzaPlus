import prismaClient from "../../prisma/index";

interface ListProductByCategoryServiceProps {
  category_id: string;
}

class ListProductByCategoryService {
  async execute({ category_id }: ListProductByCategoryServiceProps) {
    try {
      const category = await prismaClient.category.findUnique({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const products = await prismaClient.product.findMany({
        where: {
          category_id: category_id,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          disabled: true,
          category_id: true,
          CreatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          CreatedAt: "desc",
        },
      });

      return products;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao listar produtos por categoria");
    }
  }
}

export { ListProductByCategoryService };
