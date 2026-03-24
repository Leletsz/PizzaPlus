import prismaClient from "../../prisma/index";

interface ListProductServiceProps {
  disabled?: string;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          disabled: disabled === "true" ? true : false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          disabled: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "desc",
        },
      });

      return products;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao listar produtos");
    }
  }
}

export { ListProductService };
