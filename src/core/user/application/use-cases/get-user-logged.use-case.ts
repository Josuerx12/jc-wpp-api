import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";

export class GetUserLoggedUseCase
  implements UseCase<GetUserLoggedInput, GetUserLoggedOutput>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: GetUserLoggedInput): Promise<GetUserLoggedOutput> {
    const user = authStorage.get().user();

    delete user.password;
    delete user.code;

    return {
      data: user,
    };
  }
}

export type GetUserLoggedInput = {
  user: UserEntity;
};

export type GetUserLoggedOutput = {
  data: UserEntity;
};
