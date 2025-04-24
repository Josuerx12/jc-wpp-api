import { Router } from "express";
import wppRouter from "./whatsapp/whatsapp.route";
import userRouter from "./user/user.route";

const router = Router();

router.use("/wpp", wppRouter);
router.use("/users", userRouter);

export default router;
