import express from "express";
import cors from "cors";

import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes";
import mongoose from "mongoose";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Pokedex API funcionando!",
        banco: mongoose.connection.readyState
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Pokedex API funcionando!",
        banco: mongoose.connection.readyState
    });
});


app.use(routes);


app.use(notFoundMiddleware);

//erro geral que não foi tratado
app.use(errorMiddleware);

export default app;
