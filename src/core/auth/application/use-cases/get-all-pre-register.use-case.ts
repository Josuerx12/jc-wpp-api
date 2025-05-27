import { PaginationOutput } from "../../../../shared/domain/contracts/pagination-output";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import {
  IPreRegisterRepository,
  PreRegisterInputParams,
} from "../../domain/contracts/pre-register.interface";
import {
  PreRegisterOutput,
  PreRegisterOutputMapper,
} from "../shared/pre-register.output";

export class GetAllPreRegisterUseCase
  implements
    UseCase<PreRegisterInputParams, PaginationOutput<PreRegisterOutput>>
{
  constructor(private readonly repository: IPreRegisterRepository) {}

  async execute(
    input: PreRegisterInputParams
  ): Promise<PaginationOutput<PreRegisterOutput>> {
    const user = authStorage.get().user();
    if (user.isUser()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const preRegisters = await this.repository.getAll(input);

    return {
      data: preRegisters.data.map(PreRegisterOutputMapper.toOutput),
      page: preRegisters.page,
      totalPages: preRegisters.totalPages,
      totalItems: preRegisters.totalItems,
      perPage: preRegisters.perPage,
    };
  }
}
