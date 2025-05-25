import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { PreRegisterController } from "../../../../core/auth/application/controllers/pre-register.controller";

const preRegisterRouter: Router = Router();

const preRegisterController = new PreRegisterController();

preRegisterRouter.post(
  "/approve",
  checkAuth,
  preRegisterController.approveRegister
);

preRegisterRouter.get("/", checkAuth, preRegisterController.getAll);

export default preRegisterRouter;
