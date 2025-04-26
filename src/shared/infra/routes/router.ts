import { Router } from "express";
import instanceRouter from "./instance/instance.route";
import userRouter from "./user/user.route";

const router = Router();

router.use("/instance", instanceRouter);
router.use("/users", userRouter);

export default router;
