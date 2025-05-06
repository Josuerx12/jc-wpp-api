import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generatePreRegisterEmailHTML } from "../../../mail/domain/templates/pre-register.mail";
import { mail } from "../../../mail/infra/transporter";
import { IPreRegisterRepository } from "../contracts/pre-register.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export class PreRegisterUseCase
  implements UseCase<PreRegisterInput, PreRegisterOutput>
{
  constructor(private readonly repository: IPreRegisterRepository) {}
  async execute(input: PreRegisterInput): Promise<void> {
    const emailAlreadyPreRegistered = await this.repository.getByEmail(
      input.email
    );

    if (emailAlreadyPreRegistered) {
      throw new Error(
        "Email informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento."
      );
    }

    const documentAlreadyPreRegistered = await this.repository.getByDocument(
      input.document
    );

    if (documentAlreadyPreRegistered) {
      throw new Error(
        "Documento informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento."
      );
    }

    const preRegister = new PreRegisterEntity(input);

    await this.repository.create(preRegister);

    mail.sendMail(
      new MailEntity({
        to: preRegister.email,
        subject: "Pré-cadastro JCWPPAPI realizado com sucesso!",
        html: generatePreRegisterEmailHTML(preRegister.name),
      })
    );
  }
}

export type PreRegisterInput = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

export type PreRegisterOutput = void;
