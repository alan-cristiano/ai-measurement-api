import { Router } from "express";
import { container } from "tsyringe";
import { MeasureService } from "../services/measure.services";
import { MeasureController } from "../controllers/measure.controllers";
import { ensure } from "../middlewares/ensure.middleware";
import {
    createMeasurePayloadSchema,
    updateMeasurePayloadSchema,
} from "../schemas/measure.schemas";

const measureRouter = Router();
container.registerSingleton("MeasureService", MeasureService);
const measureController = container.resolve(MeasureController);

measureRouter.post(
    "/upload",
    ensure.bodyIsValid(createMeasurePayloadSchema),
    measureController.create
);

measureRouter.patch(
    "/confirm",
    ensure.bodyIsValid(updateMeasurePayloadSchema),
    measureController.update
);

measureRouter.get("/:customer_code/list", measureController.list);

export { measureRouter };
