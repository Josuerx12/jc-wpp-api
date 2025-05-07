import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IPreRegisterRepository } from "../contracts/pre-register.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export class GetAllPreRegisterUseCase
  implements UseCase<null, PreRegisterEntity[]>
{
  constructor(private readonly repository: IPreRegisterRepository) {}

  async execute(): Promise<PreRegisterEntity[]> {
    const preRegisters = await this.repository.getAll();

    return preRegisters;
  }
}
