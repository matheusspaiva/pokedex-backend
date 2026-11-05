import type { Request, Response } from "express";
import dotenv from "dotenv";
import app from "../app";
import { connectDatabase } from "../config/database";

dotenv.config();

export default async function handler(req: Request, res: Response) {
    console.log(`[vercel] Requisição recebida: ${req.method} ${req.originalUrl}`);

    try {
        await connectDatabase();
        console.log("[vercel] Banco de dados pronto");
        return app(req, res);
    } catch (error) {
        console.error("[vercel] Falha ao preparar o banco de dados:", error);

        return res.status(500).json({
            code: 500,
            status: "ERROR",
            message: "Não foi possível conectar ao banco de dados."
        });
    }
}
