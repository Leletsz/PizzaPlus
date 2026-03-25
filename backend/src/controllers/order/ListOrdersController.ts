import { Request, Response } from "express";
import { ListOrderService } from "../../services/order/ListOrdersService";

class ListOrdersController {
    async handle(req: Request, res: Response) {
        const listOrderService = new ListOrderService();
        const orders = await listOrderService.execute({ draft: req.query.draft as string });
        return res.json(orders);
    }
}

export { ListOrdersController };