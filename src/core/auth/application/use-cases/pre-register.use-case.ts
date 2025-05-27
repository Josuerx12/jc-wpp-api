import { DocumentTypeEnum } from "../../../../generated/prisma";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generatePreRegisterEmailHTML } from "../../../mail/domain/templates/pre-register.mail";
import { mail } from "../../../mail/infra/transporter";
import { IUserRepository } from "../../../user/domain/contracts/user-repository.interface";
import { EmailVO } from "../../../user/domain/vo/email.vo";
import { IPreRegisterRepository } from "../../domain/contracts/pre-register.interface";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";

export class PreRegisterUseCase
  implements UseCase<PreRegisterInput, PreRegisterOutput>
{
  constructor(
    private readonly repository: IPreRegisterRepository,
    private readonly userRepo: IUserRepository
  ) {}
  async execute(input: PreRegisterInput): Promise<void> {
    try {
      const preRegister = new PreRegisterEntity(input);

      const emailAlreadyPreRegistered = await this.repository.getByEmail(
        preRegister.email.value
      );

      const emailAlreadyRegistered = await this.userRepo.getByEmail(
        preRegister.email.value
      );

      if (emailAlreadyPreRegistered || emailAlreadyRegistered) {
        throw new AppError(
          "Email informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento.",
          400
        );
      }

      const documentAlreadyPreRegistered = await this.repository.getByDocument(
        preRegister.document.value
      );

      const documentAlreadyRegistered = await this.userRepo.getByDocument(
        preRegister.document.value
      );

      if (documentAlreadyPreRegistered || documentAlreadyRegistered) {
        throw new AppError(
          "Documento informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento.",
          400
        );
      }

      await this.repository.create(preRegister);

      mail.sendMail(
        new MailEntity({
          to: preRegister.email.value,
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
  documentType: DocumentTypeEnum;
  password: string;
};

export type PreRegisterOutput = void;
