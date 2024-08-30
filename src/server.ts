import { app } from "./app";
import { logger } from "./configs/winston.logger";

const PORT = 3000;

app.listen(PORT, () => {
    logger.info(`API is running on port ${PORT}`);
});
