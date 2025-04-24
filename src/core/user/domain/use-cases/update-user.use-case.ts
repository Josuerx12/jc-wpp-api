import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";

export class UpdateUserUseCase implements UseCase<UpdateUserInput, User> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.repository.getById(input.id);

    if (input.document) {
      await this.validateDocument(input.document);
      user.document = input.document;
    }

    if (input.email) {
      await this.validateEmail(input.email);
      user.email = input.email;
    }

    if (input.name) {
      user.name = input.name;
    }

    await this.repository.update(user);

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

export type UpdateUserInput = {
  id: string;
  name?: string;
  document?: string;
  email?: string;
};
