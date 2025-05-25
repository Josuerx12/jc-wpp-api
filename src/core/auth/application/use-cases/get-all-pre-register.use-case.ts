import { PaginationOutput } from "../../../../shared/domain/contracts/pagination-output";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { User } from "../../../user/domain/entities/user.entity";
import { UserRoles } from "../../../user/infra/models/user.model.mapper";
import {
  IPreRegisterRepository,
  PreRegisterInputParams,
} from "../../domain/contracts/pre-register.interface";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";

export type GetAllPreRegistersInput = {
  user: User;
} & PreRegisterInputParams;

export class GetAllPreRegisterUseCase
  implements
    UseCase<GetAllPreRegistersInput, PaginationOutput<PreRegisterEntity>>
{
  constructor(private readonly repository: IPreRegisterRepository) {}

  async execute(
    input: GetAllPreRegistersInput
  ): Promise<PaginationOutput<PreRegisterEntity>> {
    if (input.user.role.includes(UserRoles.USER)) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const preRegisters = await this.repository.getAll(input);

    return preRegisters;
  }
}
