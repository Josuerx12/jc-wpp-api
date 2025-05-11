import { Router } from "express";
import { PreRegisterRepository } from "../../../../core/auth/infra/repositories/pre-register.repository";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { LoginUseCase } from "../../../../core/auth/domain/use-cases/login.use-case";
import { PreRegisterUseCase } from "../../../../core/auth/domain/use-cases/pre-register.use-case";

const authRouter = Router();

const preRegisterRepository = new PreRegisterRepository();
const userRepository = new UserRepository();

const loginUseCase = new LoginUseCase(userRepository);
const preRegisterUseCase = new PreRegisterUseCase(
  preRegisterRepository,
  userRepository
);

authRouter.post("/login", async (req, res) => {
  const payload = await loginUseCase.execute(req.body);

  res.json({ data: { ...payload } });
});

authRouter.post("/pre-register", async (req, res) => {
  await preRegisterUseCase.execute(req.body);

  res.status(201).end();
});

export default authRouter;
