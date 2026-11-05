import dotenv from "dotenv";
import app from "../app";
import { connectDatabase } from "../config/database";

dotenv.config();

let databaseConnected = false;

export default async function handler(req: any, res: any) {
    if (!databaseConnected) {
        await connectDatabase();
        databaseConnected = true;
    }

    return app(req, res);
}