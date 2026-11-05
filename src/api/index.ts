import type { Request, Response } from "express";
import dotenv from "dotenv";
import app from "../app";
import { connectDatabase } from "../config/database";

dotenv.config();

export default async function handler(req: Request, res: Response) {
    await connectDatabase();
    return app(req, res);
}
