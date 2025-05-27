import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import {
  IPreRegisterRepository,
  PreRegisterInputParams,
  PreRegisterOutputParams,
} from "../../domain/contracts/pre-register.interface";

export class GetAllPreRegisterUseCase
  implements UseCase<PreRegisterInputParams, PreRegisterOutputParams>
{
  constructor(private readonly repository: IPreRegisterRepository) {}

  async execute(
    input: PreRegisterInputParams
  ): Promise<PreRegisterOutputParams> {
    const user = authStorage.get().user();
    if (user.isUser()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const preRegisters = await this.repository.getAll(input);

    return preRegisters;
  }
}
