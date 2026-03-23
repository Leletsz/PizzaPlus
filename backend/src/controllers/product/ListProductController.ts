import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController {
  async handle(req: Request, res: Response) {
    const disabledParam = req.query.disabled;

    // Converte string "true"/"false" para boolean — padrão: false
    const disabled = disabledParam === "true";

    const listProducts = new ListProductService();
    const products = await listProducts.execute({ disabled });

    return res.json(products);
  }
}

export { ListProductController };
