import winston from "winston";

const { combine, timestamp, colorize, printf, align } = winston.format;

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "cyan",
        http: "magenta",
        debug: "white",
    },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "http",
    format: combine(
        colorize({ all: true }),
        timestamp(),
        align(),
        printf((info) => {
            return `[${info.timestamp}] ${info.level}: ${info.message.trim()}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export { logger };
