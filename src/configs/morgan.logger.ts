import morgan from "morgan";
import { logger } from "./winston.logger";

export const customMorganLogger = morgan("dev", {
    stream: {
        write: (message) => logger.http(message),
    },
});
