import express from "express";
import { connectDB } from "./shared/infra/config/db";
import { config } from "dotenv";
import router from "./shared/infra/routes/router";
import cors from "cors";
import { errorMiddleware } from "./shared/infra/middlewares/error.middleware";
config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", router);
app.use(errorMiddleware);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
