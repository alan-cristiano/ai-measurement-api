class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public errorCode: string
    ) {
        super(message);
    }
}

export { AppError };
