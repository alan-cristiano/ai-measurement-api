import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../configs/winston.logger";
import { AppError } from "../errors/app-error";
import { GoogleGenerativeAIError } from "@google/generative-ai";

class HandleErrors {
    public execute = (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: error.flatten().fieldErrors,
            });
        } else if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error_code: error.errorCode,
                error_description: error.message,
            });
        } else if (error instanceof GoogleGenerativeAIError) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: {
                    image: ["Invalid input"],
                },
            });
        } else {
            logger.error(error);
            return res
                .status(500)
                .json({
                    error_code: "SERVER_ERROR",
                    error_description: "Internal server error.",
                });
        }
    };
}

const handlErrors = new HandleErrors();

export { handlErrors };
