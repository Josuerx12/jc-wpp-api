import { DocumentTypeEnum } from "../../../../generated/prisma";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";
import { CnpjVo } from "../../domain/vo/cnpj.vo";
import { CpfVo } from "../../domain/vo/cpf.vo";
import { EmailVO } from "../../domain/vo/email.vo";

export class UpdateUserUseCase implements UseCase<UpdateUserInput, UserEntity> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UserEntity> {
    const loggedUser = authStorage.get().user();

    const user = await this.repository.getById(input.id);

    if (
      loggedUser.id != user.id &&
      loggedUser.isSuper() &&
      loggedUser.isAdmin()
    ) {
      throw new AppError("Você não tem acesso a essa rota.");
    }

    if (
      input.documentType &&
      input.document &&
      input.document != user.document.value
    ) {
      user.documentType = input.documentType;
      user.document =
        input.documentType === DocumentTypeEnum.CPF
          ? new CpfVo(input.document)
          : new CnpjVo(input.document);
      await this.validateDocument(user.document.value);
    }

    if (input.email && input.email != user.email.value) {
      const email = EmailVO.create(input.email);

      await this.validateEmail(email.value);
      user.email = email;
    }

    if (input.name) {
      user.name = input.name;
    }

    await this.repository.update(user);

    delete user.password;
    delete user.code;

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
  documentType?: DocumentTypeEnum;
  email?: string;
};
