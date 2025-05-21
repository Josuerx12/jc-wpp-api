import { Router } from "express";
import { PreRegisterRepository } from "../../../../core/auth/infra/repositories/pre-register.repository";
import { LoginUseCase } from "../../../../core/auth/domain/use-cases/login.use-case";
import { PreRegisterUseCase } from "../../../../core/auth/domain/use-cases/pre-register.use-case";
import { RequestResetPasswordUseCase } from "../../../../core/user/domain/use-cases/request-reset-password.use-case";
import { ResetPasswordUseCase } from "../../../../core/user/domain/use-cases/reset-password.use-case";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";

const authRouter: Router = Router();

const preRegisterRepository = new PreRegisterRepository();
const userRepository = new UserRepository();

const loginUseCase = new LoginUseCase(userRepository);
const preRegisterUseCase = new PreRegisterUseCase(
  preRegisterRepository,
  userRepository
);
const requestResetPasswordUseCase = new RequestResetPasswordUseCase(
  userRepository
);
const resetPassword = new ResetPasswordUseCase(userRepository);

authRouter.post("/login", async (req, res) => {
  const payload = await loginUseCase.execute(req.body);

  res.json({ data: { ...payload } });
});

authRouter.post("/pre-register", async (req, res) => {
  await preRegisterUseCase.execute(req.body);

  res.status(201).end();
});

authRouter.post("/request-reset-password", async (req, res) => {
  await requestResetPasswordUseCase.execute(req.body);

  res.status(204).end();
});

authRouter.post("/reset-password", async (req, res) => {
  await resetPassword.execute(req.body);

  res.status(204).end();
});

export default authRouter;
