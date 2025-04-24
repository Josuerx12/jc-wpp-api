import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";

export class CreateUserUseCase implements UseCase<CreateUserInput, User> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    await this.validateDocument(input.document);
    await this.validateEmail(input.email);

    const user = new User({ ...input, userId: v4() });

    await this.repository.create(user);

    delete user.password;

    return user;
  }

  private async validateEmail(email: string) {
    const user = await this.repository.getByEmail(email);

    if (user) {
      throw new Error("Email already in use.");
    }
  }

  private async validateDocument(document: string) {
    const user = await this.repository.getByEmail(document);

    if (user) {
      throw new Error("Document already in use.");
    }
  }
}

export type CreateUserInput = {
  name: string;
  document: string;
  email: string;
  password: string;
};
