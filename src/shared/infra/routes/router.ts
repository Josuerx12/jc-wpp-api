import { Router } from "express";
import instanceRouter from "./instance/instance.route";
import userRouter from "./user/user.route";
import authRouter from "./auth/auth.route";

const router = Router();

router.use("/instance", instanceRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
