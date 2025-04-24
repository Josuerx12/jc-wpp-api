import express from "express";
import { connectDB } from "./shared/infra/config/db";
import { config } from "dotenv";
import router from "./shared/infra/routes/router";
config();

connectDB();

const app = express();
app.use(express.json());

app.use("/api", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
