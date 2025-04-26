import { sign } from "jsonwebtoken";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../../../user/domain/contracts/user-repository.interface";
import { User } from "../../../user/domain/entities/user.entity";

export class LoginUseCase implements UseCase<LoginInput, LoginOutput> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.repository.getByEmail(input.email);

    if (!user) {
      throw new Error("Verifique as credenciais e tente novamente.");
    }

    user.verifyPassword(input.password);

    delete user.password;
    delete user.code;

    const token = sign({ sub: user }, process.env.SECRET);

    return {
      access_token: token,
      user,
    };
  }
}

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  access_token: string;
  user: User;
};
