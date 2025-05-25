import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { UserController } from "../../../../core/user/application/controllers/user.controller";

const userRouter: Router = Router();

const controller = new UserController();

userRouter.post(
  "/refresh-user-secret",
  checkAuth,
  controller.refreshUserSecret
);

userRouter.get("/user-secret", checkAuth, controller.getUserSecret);

userRouter.post("/", checkAuth, controller.create);

userRouter.put("/:id", checkAuth, controller.update);

userRouter.get("/user-logged", checkAuth, controller.getMe);

userRouter.get("/:id/instances", checkAuth, controller.getUserInstances);

userRouter.get("/", checkAuth, controller.getAll);

userRouter.post("/change-password", checkAuth, controller.changePassword);

userRouter.delete("/:id", checkAuth, controller.deleteById);

export default userRouter;
