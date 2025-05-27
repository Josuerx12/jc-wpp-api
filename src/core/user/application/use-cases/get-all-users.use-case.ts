import { PaginationOutput } from "../../../../shared/domain/contracts/pagination-output";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import {
  IUserRepository,
  UserInputParams,
  UserOutputParams,
} from "../../domain/contracts/user-repository.interface";
import { UserOutput, UserOutputMapper } from "../shared/user.output";

export class GetAllUsersUseCase
  implements UseCase<UserInputParams, PaginationOutput<UserOutput>>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UserInputParams): Promise<PaginationOutput<UserOutput>> {
    const user = authStorage.get().user();

    if (!user.isAdmin() && !user.isSuper()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const users = await this.repository.getAll(input);

    return {
      data: users.data.map(UserOutputMapper.toOutput),
      page: users.page,
      perPage: users.perPage,
      totalItems: users.totalItems,
      totalPages: users.totalPages,
    };
  }
}
