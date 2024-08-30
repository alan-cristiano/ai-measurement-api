import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

class EnsureMiddleware {
    public bodyIsValid = (schema: ZodSchema) => {
        return (req: Request, res: Response, next: NextFunction) => {
            req.body = schema.parse(req.body);

            return next();
        };
    };
}

const ensure = new EnsureMiddleware();

export { ensure };
