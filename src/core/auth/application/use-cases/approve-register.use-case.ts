import { v4 } from "uuid";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { User } from "../../../user/domain/entities/user.entity";
import { mail } from "../../../mail/infra/transporter";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generateApprovedRegisterEmailHTML } from "../../../mail/domain/templates/approved-register.email";
import { UserRoles } from "../../../user/infra/models/user.model.mapper";
import { GenerateRandomString } from "../../../../shared/helpers";
import { IUserRepository } from "../../../user/domain/contracts/user-repository.interface";
import { IPreRegisterRepository } from "../../domain/contracts/pre-register.interface";

export type ApproveRegisterInput = {
  id: string;

  user: User;
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
      const preRegister = await this.preRegisterRepo.getById(input.id);

      if (input.user && input.user.role === UserRoles.USER) {
        throw new AppError(
          "Você não tem permissão para acessar essa rota",
          401
        );
      }

      if (!preRegister) {
        throw new AppError("Nenhum pre registro encontrado para esse id.", 400);
      }

      const generatedPass = GenerateRandomString(8);

      const user = new User({
        userId: v4(),
        name: preRegister.name,
        document: preRegister.document,
        email: preRegister.email,
        password: generatedPass,
        isTempPass: true,
      });

      await this.userRepo.create(user);

      mail.sendMail(
        new MailEntity({
          to: user.email,
          subject: "Cadastro aprovado - Acesse sua conta na JCWPPAPI!",
          html: generateApprovedRegisterEmailHTML(user.name, generatedPass),
        })
      );

      await this.preRegisterRepo.delete(preRegister.preRegisterId);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  }
}
