import { Router } from "express";
import { PreRegisterRepository } from "../../../../core/auth/infra/repositories/pre-register.repository";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { LoginUseCase } from "../../../../core/auth/domain/use-cases/login.use-case";
import { PreRegisterUseCase } from "../../../../core/auth/domain/use-cases/pre-register.use-case";
import { ApproveRegisterUseCase } from "../../../../core/auth/domain/use-cases/approve-register.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { GetAllPreRegisterUseCase } from "../../../../core/auth/domain/use-cases/get-all-pre-register.use-case";

const preRegisterRouter = Router();

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
  await approveRegisterUseCase.execute({
    ...req.body,
    user: req.user,
  });

  res.status(204).end();
});

preRegisterRouter.get("/", async (req, res) => {
  const payload = await getAllPreRegisterUseCase.execute();

  res.status(200).json({ payload });
});

export default preRegisterRouter;
