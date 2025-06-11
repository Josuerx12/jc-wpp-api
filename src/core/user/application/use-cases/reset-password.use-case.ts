import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { changedPasswordSuccessEmailHTML } from "../../../mail/domain/templates/changed-password.email";
import { mail } from "../../../mail/infra/transporter";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";

export class ResetPasswordUseCase implements UseCase<ResetPasswordInput, void> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const user = await this.repository.getByCode(input.code);

    if (!user) {
      throw new AppError("Codigo informado não encontrado.", 404);
    }

    if (!input.newPassword || input.newPassword.length < 6) {
      throw new AppError("Nova senha deve conter mais de 6 caracteres.");
    }

    user.resetPasswordWithCode(input.code, input.newPassword);

    await this.repository.update(user);

    const email = new MailEntity({
      to: user.email.value,
      subject: "Senha alterada com sucesso",
      html: changedPasswordSuccessEmailHTML(user.name),
    });

    mail.sendMail(email);
  }
}

export type ResetPasswordInput = {
  code: string;
  newPassword: string;
};
