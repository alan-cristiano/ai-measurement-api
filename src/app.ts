import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import "express-async-errors";
import { checkEnvVariables } from "./configs/checkEnvVariables";
import { customMorganLogger } from "./configs/morgan.logger";
import { measureRouter } from "./routers/measure.routes";
import { handlErrors } from "./middlewares/handle-errors.middleware";

const initApp = () => {
    const app = express();

    app.use(customMorganLogger);

    app.use(helmet());

    app.use(express.json());

    checkEnvVariables();

    app.use("", measureRouter);

    app.use(handlErrors.execute);

    return app;
};

const app = initApp();

export { app };
