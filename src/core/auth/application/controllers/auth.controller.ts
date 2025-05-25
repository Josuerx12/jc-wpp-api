import { Request, Response } from "express";
import { UserRepository } from "../../../user/infra/repositories/user.repository";
import { PreRegisterRepository } from "../../infra/repositories/pre-register.repository";
import { LoginUseCase } from "../use-cases/login.use-case";
import { PreRegisterUseCase } from "../use-cases/pre-register.use-case";
import { RequestResetPasswordUseCase } from "../../../user/application/use-cases/request-reset-password.use-case";
import { ResetPasswordUseCase } from "../../../user/application/use-cases/reset-password.use-case";

export class AuthController {
  private preRegisterRepository = new PreRegisterRepository();
  private userRepository = new UserRepository();
  private loginUseCase = new LoginUseCase(this.userRepository);
  private preRegisterUseCase = new PreRegisterUseCase(
    this.preRegisterRepository,
    this.userRepository
  );
  private requestResetPasswordUseCase = new RequestResetPasswordUseCase(
    this.userRepository
  );
  private resetPasswordUseCase = new ResetPasswordUseCase(this.userRepository);

  login = async (req: Request, res: Response) => {
    const payload = await this.loginUseCase.execute(req.body);

    res.json({ data: { ...payload } });
  };

  signUp = async (req: Request, res: Response) => {
    await this.preRegisterUseCase.execute(req.body);

    res.status(201).end();
  };

  requestResetPassword = async (req: Request, res: Response) => {
    await this.requestResetPasswordUseCase.execute(req.body);

    res.status(204).end();
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.resetPasswordUseCase.execute(req.body);

    res.status(204).end();
  };
}
