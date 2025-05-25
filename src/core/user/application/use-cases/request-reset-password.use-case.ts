import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { generateResetPasswordEmailHTML } from "../../../mail/domain/templates/request-reset-password.email";
import { mail } from "../../../mail/infra/transporter";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";

export class RequestResetPasswordUseCase
  implements UseCase<RequestResetPasswordInput, void>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: RequestResetPasswordInput): Promise<void> {
    const user = await this.repository.getByDocumentOrEmail(input.login);

    if (!user) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;
    do {
      user.generateCode();
      const codeInUse = await this.repository.getByCode(user.code);
      if (!codeInUse) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts === maxAttempts) {
      throw new AppError(
        "Não foi possível solicitar o reset de senha, tente novamente mais tarde.",
        400
      );
    }

    await this.repository.update(user);

    const email = new MailEntity({
      to: user.email,
      subject: "Recuperação de senha",
      html: generateResetPasswordEmailHTML(
        user.name,
        user.code,
        "https://jcwpp.jcdev.com.br/auth/reset-password?code=" + user.code
      ),
    });

    mail.sendMail(email);
  }
}

export type RequestResetPasswordInput = {
  login: string;
};
