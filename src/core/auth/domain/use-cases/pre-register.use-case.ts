import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generatePreRegisterEmailHTML } from "../../../mail/domain/templates/pre-register.mail";
import { mail } from "../../../mail/infra/transporter";
import { IUserRepository } from "../../../user/domain/contracts/user-repository.interface";
import { DocumentVO } from "../../../user/domain/vo/document.vo";
import { EmailVO } from "../../../user/domain/vo/email.vo";
import { IPreRegisterRepository } from "../contracts/pre-register.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export class PreRegisterUseCase
  implements UseCase<PreRegisterInput, PreRegisterOutput>
{
  constructor(
    private readonly repository: IPreRegisterRepository,
    private readonly userRepo: IUserRepository
  ) {}
  async execute(input: PreRegisterInput): Promise<void> {
    try {
      const email = EmailVO.create(input.email);
      const document = DocumentVO.create(input.document.replace(/\D/g, ""));

      const emailAlreadyPreRegistered = await this.repository.getByEmail(
        email.value
      );

      const emailAlreadyRegistered = await this.userRepo.getByEmail(
        email.value
      );

      if (emailAlreadyPreRegistered || emailAlreadyRegistered) {
        throw new AppError(
          "Email informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento.",
          400
        );
      }

      const documentAlreadyPreRegistered = await this.repository.getByDocument(
        document.value
      );

      const documentAlreadyRegistered = await this.userRepo.getByDocument(
        document.value
      );

      if (documentAlreadyPreRegistered || documentAlreadyRegistered) {
        throw new AppError(
          "Documento informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento.",
          400
        );
      }

      const preRegister = new PreRegisterEntity({
        ...input,
        document: document.value,
        email: email.value,
      });

      await this.repository.create(preRegister);

      mail.sendMail(
        new MailEntity({
          to: preRegister.email,
          subject: "Pré-cadastro JCWPPAPI realizado com sucesso!",
          html: generatePreRegisterEmailHTML(preRegister.name),
        })
      );
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  }
}

export type PreRegisterInput = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

export type PreRegisterOutput = void;
