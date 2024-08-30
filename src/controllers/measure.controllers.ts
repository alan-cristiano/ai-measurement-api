import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
    IMeasureController,
    IMeasureService,
} from "../interfaces/measure.interfaces";

@injectable()
class MeasureController implements IMeasureController {
    constructor(@inject("MeasureService") private service: IMeasureService) {}

    public create = async (req: Request, res: Response): Promise<Response> => {
        const result = await this.service.create(req.body);

        return res.status(200).json(result);
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        await this.service.update(req.body);

        return res.status(200).json({ success: true });
    };

    public list = async (req: Request, res: Response): Promise<Response> => {
        const customerCode = req.params.customer_code;
        const queryMeasureType = req.query.measure_type
            ? String(req.query.measure_type).toUpperCase()
            : undefined;

        const result = await this.service.list(customerCode, queryMeasureType);

        return res.status(200).json(result);
    };
}

export { MeasureController };
