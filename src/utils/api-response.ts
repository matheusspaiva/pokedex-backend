
import { Response } from "express";

interface ApiResponseData<T> {
    code: number;
    status: string;
    message: string;
    data: T | null;
}

export const apiResponse = <T>(
    res: Response,
    code: number,
    status: string,
    message: string,
    data: T | null = null
) => {
    return res.status(code).json({
        code,
        status,
        message,
        data
    });
};

export const apiResponseOK = <T>(
    res: Response,
    message: string,
    data: T | null = null
) => apiResponse(res, 200, "OK", message, data);

export const apiResponseCreated = <T>(
    res: Response,
    message: string,
    data: T | null = null
) => apiResponse(res, 201, "CREATED", message, data);

export const apiResponseBadRequest = (
    res: Response,
    message: string,
    data: unknown = null
) => apiResponse(res, 400, "BAD_REQUEST", message, data);

export const apiResponseUnauthorized = (
    res: Response,
    message: string = "Não autorizado!"
) => apiResponse(res, 401, "UNAUTHORIZED", message);

export const apiResponseForbidden = (
    res: Response,
    message: string = "Acesso negado!"
) => apiResponse(res, 403, "FORBIDDEN", message);

export const apiResponseNotFound = (
    res: Response,
    message: string = "Registro não encontrado!"
) => apiResponse(res, 404, "NOT_FOUND", message);

export const apiResponseConflict = (
    res: Response,
    message: string,
    data: unknown = null
) => apiResponse(res, 409, "CONFLICT", message, data);

export const apiResponseInternalServerError = (
    res: Response,
    message: string = "Erro interno do servidor!"
) => apiResponse(res, 500, "INTERNAL_SERVER_ERROR", message);
