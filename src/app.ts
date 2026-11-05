import express from "express";
import cors from "cors";

import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Pokedex API funcionando!"
    });
});


app.use(routes);


app.use(notFoundMiddleware);

//erro geral que não foi tratado
app.use(errorMiddleware);

export default app;