import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI não configurada!");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(mongoUri).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }

    try {
        await connectionPromise;
        console.log("MongoDB conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        throw error;
    }
};
