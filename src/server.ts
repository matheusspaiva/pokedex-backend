import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/database";

dotenv.config();

export default app;

const startServer = async () => {
    await connectDatabase();

    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
};

if (process.env.VERCEL !== "1") {
    startServer().catch((error) => {
        console.error("Erro ao iniciar o servidor:", error);
        process.exitCode = 1;
    });
}
