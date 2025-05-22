import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IInstanceRepository } from "../../../instances/domain/contracts/instance.interface";
import { DeleteInstanceUseCase } from "../../../instances/domain/use-cases/delete-instance.use-case";
import { IUserRepository } from "../contracts/user-repository.interface";

export interface DeleteUserInput {
  id: string;
}

export class DeleteUserUseCase implements UseCase<DeleteUserInput, void> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly instanceRepo: IInstanceRepository,
    private readonly deleteInstanceUseCase: DeleteInstanceUseCase
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const authUser = authStorage.get().user();

    if (!authUser.isAdmin() && !authUser.isSuper()) {
      throw new Error("Você não tem permissão para excluir usuários.");
    }

    const user = await this.repository.getById(input.id);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const instances = await this.instanceRepo.getAllUserInstances(user.userId);

    const promises = instances?.map(async ({ instanceId }) => {
      await this.deleteInstanceUseCase.execute({
        instanceId,
      });
    });

    await Promise.all(promises);

    await this.repository.delete(user.userId);
  }
}
