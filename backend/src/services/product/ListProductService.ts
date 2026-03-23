import prismaClient from "../../prisma/index";

interface ListProductServiceProps {
  disabled: boolean;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    const products = await prismaClient.product.findMany({
      where: {
        disabled: disabled,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        disabled: true,
        category_id: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return products;
  }
}

export { ListProductService };
