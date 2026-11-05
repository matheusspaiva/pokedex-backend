import { Request, Response, NextFunction } from "express";
import { apiResponseInternalServerError } from "../utils/api-response";

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error);
    }

    console.error(error);

    return apiResponseInternalServerError(
        res,
        "Erro interno do servidor!"
    );
};