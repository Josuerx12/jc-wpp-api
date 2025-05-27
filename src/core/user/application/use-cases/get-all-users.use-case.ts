import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import {
  IUserRepository,
  UserInputParams,
  UserOutputParams,
} from "../../domain/contracts/user-repository.interface";

export class GetAllUsersUseCase
  implements UseCase<UserInputParams, UserOutputParams>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UserInputParams): Promise<UserOutputParams> {
    const user = authStorage.get().user();

    if (!user.isAdmin() && !user.isSuper()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const users = await this.repository.getAll(input);

    return users;
  }
}
