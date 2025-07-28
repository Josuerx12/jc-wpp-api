import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { mail } from "../../../mail/infra/transporter";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generateApprovedRegisterEmailHTML } from "../../../mail/domain/templates/approved-register.email";
import { GenerateRandomString } from "../../../../shared/helpers";
import { IUserRepository } from "../../../user/domain/contracts/user-repository.interface";
import { IPreRegisterRepository } from "../../domain/contracts/pre-register.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { UserEntity } from "../../../user/domain/entities/user.entity";

export type ApproveRegisterInput = {
  id: string;
};

export class ApproveRegisterUseCase
  implements UseCase<ApproveRegisterInput, void>
{
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly preRegisterRepo: IPreRegisterRepository
  ) {}

  async execute(input: ApproveRegisterInput): Promise<void> {
    try {
      const user = authStorage.get().user();

      const preRegister = await this.preRegisterRepo.getById(input.id);

      if (user?.isUser()) {
        throw new AppError(
          "Você não tem permissão para acessar essa rota",
          401
        );
      }

      if (!preRegister) {
        throw new AppError("Nenhum pre registro encontrado para esse id.", 400);
      }

      const entity = new UserEntity({
        name: preRegister.name,
        document: preRegister.document.value,
        email: preRegister.email.value,
        password: preRegister.password,
        documentType: preRegister.documentType,
        phone: preRegister.phone,
      });

      await this.userRepo.create(entity);

      mail.sendMail(
        new MailEntity({
          to: entity.email.value,
          subject: "Cadastro aprovado - Acesse sua conta na JCWPPAPI!",
          html: generateApprovedRegisterEmailHTML(user.name),
        })
      );

      await this.preRegisterRepo.delete(preRegister.id);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  }
}
