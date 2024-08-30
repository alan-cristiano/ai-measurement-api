import { z } from "zod";
import {
    createMeasurePayloadSchema,
    createMeasureReturnSchema,
    listMeasuresReturnSchema,
    measureDbSchema,
    measureSchema,
    updateMeasurePayloadSchema,
} from "../schemas/measure.schemas";
import { Request, Response } from "express";

type Measure = z.infer<typeof measureSchema>;
type MeasureDb = z.infer<typeof measureDbSchema>;
type CreateMeasurePayload = z.infer<typeof createMeasurePayloadSchema>;
type CreateMeasureReturn = z.infer<typeof createMeasureReturnSchema>;
type UpdateMeasurePayload = z.infer<typeof updateMeasurePayloadSchema>;
type ListMeasuresReturn = z.infer<typeof listMeasuresReturnSchema>;

interface IMeasureService {
    create(payload: CreateMeasurePayload): Promise<CreateMeasureReturn>;
    update(payload: UpdateMeasurePayload): Promise<void>;
    list(
        customerCode: string,
        measureType?: string
    ): Promise<ListMeasuresReturn>;
}

interface IMeasureController {
    create(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    list(req: Request, res: Response): Promise<Response>;
}

export {
    Measure,
    CreateMeasurePayload,
    IMeasureService,
    CreateMeasureReturn,
    IMeasureController,
    UpdateMeasurePayload,
    MeasureDb,
    ListMeasuresReturn,
};
