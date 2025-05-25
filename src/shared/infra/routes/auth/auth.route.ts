import { Router } from "express";
import { AuthController } from "../../../../core/auth/application/controllers/auth.controller";

const authRouter: Router = Router();

const controller = new AuthController();

authRouter.post("/login", controller.login);

authRouter.post("/pre-register", controller.signUp);

authRouter.post("/request-reset-password", controller.requestResetPassword);

authRouter.post("/reset-password", controller.resetPassword);

export default authRouter;
