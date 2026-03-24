import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
    async handle(req: Request, res: Response) {
        const { product_id } = req.query as { product_id: string }

        const deleteProduct = new DeleteProductService();

        const product = await deleteProduct.execute({ id: product_id });

        return res.json(product);
    }
}

export { DeleteProductController };