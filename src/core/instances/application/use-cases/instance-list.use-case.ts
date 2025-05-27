import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { UserEntity } from "../../../user/domain/entities/user.entity";
import { IInstanceRepository } from "../../domain/contracts/instance.interface";
import { InstanceEntity } from "../../domain/entities/instance.entity";

export class InstanceListUseCase
  implements UseCase<InstanceListInput, InstanceListOutput>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: InstanceListInput): Promise<InstanceListOutput> {
    const instances = await this.repository.getAllUserInstances(input.user.id);

    return { instances };
  }
}

export type InstanceListInput = {
  user: UserEntity;
};

export type InstanceListOutput = {
  instances: InstanceEntity[];
};
