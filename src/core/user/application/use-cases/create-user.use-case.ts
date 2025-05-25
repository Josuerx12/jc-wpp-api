import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";
import { User } from "../../domain/entities/user.entity";
import { DocumentVO } from "../../domain/vo/document.vo";
import { EmailVO } from "../../domain/vo/email.vo";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";

export class CreateUserUseCase implements UseCase<CreateUserInput, User> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const loggedUser = authStorage.get().user();

    if (!loggedUser.isAdmin() && !loggedUser.isSuper()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

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
