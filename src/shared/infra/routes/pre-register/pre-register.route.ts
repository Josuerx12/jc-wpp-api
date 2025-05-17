import { Router } from "express";
import { PreRegisterRepository } from "../../../../core/auth/infra/repositories/pre-register.repository";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { ApproveRegisterUseCase } from "../../../../core/auth/domain/use-cases/approve-register.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { GetAllPreRegisterUseCase } from "../../../../core/auth/domain/use-cases/get-all-pre-register.use-case";
import authStorage from "../auth/auth.storage";

const preRegisterRouter: Router = Router();

const preRegisterRepository = new PreRegisterRepository();
const userRepository = new UserRepository();

const approveRegisterUseCase = new ApproveRegisterUseCase(
  userRepository,
  preRegisterRepository
);

const getAllPreRegisterUseCase = new GetAllPreRegisterUseCase(
  preRegisterRepository
);

preRegisterRouter.post("/approve", checkAuth, async (req, res) => {
  const user = authStorage.get().user();

  await approveRegisterUseCase.execute({
    ...req.body,
    user,
  });

  res.status(204).end();
});

preRegisterRouter.get("/", checkAuth, async (req, res) => {
  const user = authStorage.get().user();

  const payload = await getAllPreRegisterUseCase.execute({
    ...req.query,
    user,
  });

  res.status(200).json({ payload });
});

export default preRegisterRouter;
