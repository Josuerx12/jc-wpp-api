import { Request, Response } from "express";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { ApproveRegisterUseCase } from "../use-cases/approve-register.use-case";
import { UserRepository } from "../../../user/infra/repositories/user.repository";
import { PreRegisterRepository } from "../../infra/repositories/pre-register.repository";
import { GetAllPreRegisterUseCase } from "../use-cases/get-all-pre-register.use-case";

export class PreRegisterController {
  private preRegisterRepository = new PreRegisterRepository();
  private userRepository = new UserRepository();

  private approveRegisterUseCase = new ApproveRegisterUseCase(
    this.userRepository,
    this.preRegisterRepository
  );

  private getAllPreRegisterUseCase = new GetAllPreRegisterUseCase(
    this.preRegisterRepository
  );

  approveRegister = async (req: Request, res: Response) => {
    const user = authStorage.get().user();

    await this.approveRegisterUseCase.execute({
      ...req.body,
      user,
    });

    res.status(204).end();
  };

  getAll = async (req: Request, res: Response) => {
    const payload = await this.getAllPreRegisterUseCase.execute(
      req.query as any
    );

    res.status(200).json({ payload });
  };
}
