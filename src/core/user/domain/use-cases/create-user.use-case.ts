import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";
import { EmailVO } from "../vo/email.vo";
import { DocumentVO } from "../vo/document.vo";

export class CreateUserUseCase implements UseCase<CreateUserInput, User> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = EmailVO.create(input.email);
    const document = DocumentVO.create(input.document.replace(/\D/g, ""));

    await this.validateDocument(document.value);
    await this.validateEmail(email.value);

    const user = new User({
      ...input,
      email: email.value,
      document: document.value,
      userId: v4(),
    });

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
