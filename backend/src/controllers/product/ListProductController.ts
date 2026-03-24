import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController {
  async handle(req: Request, res: Response) {
    const disabled = req.query.disabled as string | undefined;

    const listProduct = new ListProductService();

    const products = await listProduct.execute({ ...(disabled !== undefined && { disabled }) });

    return res.json(products);
  }
}

export { ListProductController };
