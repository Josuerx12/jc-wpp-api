import { Router } from "express";
import wppRouter from "./whatsapp/whatsapp.route";

const router = Router();

router.use("/wpp", wppRouter);

export default router;
