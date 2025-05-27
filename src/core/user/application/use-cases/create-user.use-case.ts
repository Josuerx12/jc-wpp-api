import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";
import { EmailVO } from "../../domain/vo/email.vo";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { UserEntity } from "../../domain/entities/user.entity";
import { DocumentTypeEnum } from "../../../../generated/prisma";

export class CreateUserUseCase implements UseCase<CreateUserInput, UserEntity> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const loggedUser = authStorage.get().user();

    if (!loggedUser.isAdmin() && !loggedUser.isSuper()) {
      throw new AppError("Você não tem permissão para acessar está rota.");
    }

    const email = EmailVO.create(input.email);

    await this.validateEmail(email.value);
    await this.validateDocument(input.document);

    const user = new UserEntity({
      ...input,
      email: email.value,
      document: input.document,
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
    const user = await this.repository.getByDocument(document);

    if (user) {
      throw new Error("Document already in use.");
    }
  }
}

export type CreateUserInput = {
  name: string;
  document: string;
  documentType: DocumentTypeEnum;
  phone: string;
  email: string;
  password: string;
};
