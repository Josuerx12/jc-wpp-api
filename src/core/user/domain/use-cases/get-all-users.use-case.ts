import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { UserRoles } from "../../infra/models/user.model";
import {
  GetAllUsersInputParams,
  IUserRepository,
} from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";

export type GetAllUsersInput = {
  user: User;
} & GetAllUsersInputParams;

export class GetAllUsersUseCase implements UseCase<GetAllUsersInput, User[]> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: GetAllUsersInput): Promise<User[]> {
    if (
      input.user.role != UserRoles.ADMIN &&
      input.user.role != UserRoles.SUPER
    ) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const users = await this.repository.getAll(input);

    return users;
  }
}
