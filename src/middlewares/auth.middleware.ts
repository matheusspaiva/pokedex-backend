import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { apiResponseUnauthorized } from "../utils/api-response";

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return apiResponseUnauthorized(
            res,
            "Token de autenticação não informado!"
        );
    }

    const token = authorization.split(" ")[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return next(new Error("JWT_SECRET não configurado!"));
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string"
        ) {
            return apiResponseUnauthorized(res, "Token inválido!");
        }

        req.user = {
            userId: decoded.userId
        };

        return next();

    } catch {
        return apiResponseUnauthorized(
            res,
            "Token inválido ou expirado!"
        );
    }
};