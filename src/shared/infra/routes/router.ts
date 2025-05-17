import { Router } from "express";
import instanceRouter from "./instance/instance.route";
import userRouter from "./user/user.route";
import authRouter from "./auth/auth.route";
import sseRouter from "./sse/sse.route";
import preRegisterRouter from "./pre-register/pre-register.route";

const router: Router = Router();

router.use("/instance", instanceRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/sse", sseRouter);
router.use("/pre-register", preRegisterRouter);

export default router;
