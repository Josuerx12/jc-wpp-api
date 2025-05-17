import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { UserRoles } from "../../infra/models/user.model";
import { IUserRepository } from "../contracts/user-repository.interface";
import { User } from "../entities/user.entity";
import { DocumentVO } from "../vo/document.vo";
import { EmailVO } from "../vo/email.vo";

export class UpdateUserUseCase implements UseCase<UpdateUserInput, User> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const loggedUser = authStorage.get().user();

    const user = await this.repository.getById(input.id);

    if (
      loggedUser.userId != user.userId &&
      loggedUser.isSuper() &&
      loggedUser.isAdmin()
    ) {
      throw new AppError("Você não tem acesso a essa rota.");
    }

    if (input.document && input.document != user.document) {
      const document = DocumentVO.create(input.document.replace(/\D/g, ""));

      await this.validateDocument(document.value);
      user.document = document.value;
    }

    if (input.email && input.email != user.email) {
      const email = EmailVO.create(input.email);

      await this.validateEmail(email.value);
      user.email = email.value;
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
