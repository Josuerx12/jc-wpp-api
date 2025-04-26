import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";

export class GetUserLoggedUseCase
  implements UseCase<GetUserLoggedInput, GetUserLoggedOutput>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: GetUserLoggedInput): Promise<GetUserLoggedOutput> {
    const user = await this.repository.getById(input.user.userId);

    return {
      data: user,
    };
  }
}

export type GetUserLoggedInput = {
  user: User;
};

export type GetUserLoggedOutput = {
  data: User;
};
