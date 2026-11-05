import { Request, Response } from "express";
import { apiResponseNotFound } from "../utils/api-response";

export const notFoundMiddleware = (
    req: Request,
    res: Response
) => {
    return apiResponseNotFound(
        res,
        `Rota ${req.originalUrl} não encontrada!`
    );
};