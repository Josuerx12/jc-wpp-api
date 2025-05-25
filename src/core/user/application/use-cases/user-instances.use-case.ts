import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IInstanceRepository } from "../../../instances/domain/contracts/instance.interface";
import { InstanceEntity } from "../../../instances/domain/entities/instance.entity";

export class UserInstances
  implements UseCase<UserInstancesInput, UserInstacesOutput>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: UserInstancesInput): Promise<UserInstacesOutput> {
    const userLogged = authStorage.get().user();

    if (userLogged.isSuper() && userLogged.isAdmin()) {
      throw new AppError("Não autorizado para acessar está rota.", 401);
    }

    const instances = await this.repository.getAllUserInstances(input.userId);

    return {
      data: instances,
    };
  }
}

export type UserInstancesInput = {
  userId?: string;
};

export type UserInstacesOutput = {
  data: InstanceEntity[];
};
